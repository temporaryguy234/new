from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone
import json
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class Animation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    url: str
    animationData: Dict[str, Any]
    thumbnail: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AnimationCreate(BaseModel):
    name: str
    url: str
    animationData: Dict[str, Any]

class AnimationUpdate(BaseModel):
    name: Optional[str] = None
    animationData: Optional[Dict[str, Any]] = None
    settings: Optional[Dict[str, Any]] = None

class AIEditRequest(BaseModel):
    animationData: Dict[str, Any]
    prompt: str
    animationId: str

class AIEditResponse(BaseModel):
    success: bool
    animationData: Dict[str, Any]
    message: str

# Helper functions
def prepare_for_mongo(data):
    """Prepare data for MongoDB storage"""
    if isinstance(data, dict):
        result = {}
        for key, value in data.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
            elif isinstance(value, dict):
                result[key] = prepare_for_mongo(value)
            elif isinstance(value, list):
                result[key] = [prepare_for_mongo(item) if isinstance(item, dict) else item for item in value]
            else:
                result[key] = value
        return result
    return data

def parse_from_mongo(item):
    """Parse data from MongoDB"""
    if isinstance(item, dict):
        result = {}
        for key, value in item.items():
            if key in ['created_at', 'updated_at'] and isinstance(value, str):
                try:
                    result[key] = datetime.fromisoformat(value)
                except:
                    result[key] = value
            elif isinstance(value, dict):
                result[key] = parse_from_mongo(value)
            elif isinstance(value, list):
                result[key] = [parse_from_mongo(item) if isinstance(item, dict) else item for item in value]
            else:
                result[key] = value
        return result
    return item

async def process_ai_edit(animation_data: Dict[str, Any], prompt: str) -> Dict[str, Any]:
    """Process AI editing request using Google's Gemini model"""
    try:
        # Initialize LLM chat
        api_key = os.environ.get('GOOGLE_API_KEY') or os.environ.get('EMERGENT_LLM_KEY')
        
        if not api_key:
            raise HTTPException(status_code=500, detail="No API key available")
        
        logging.info(f"Processing AI edit with prompt: {prompt}")
        
        # Use Google's API key directly (this is more reliable for Lottie editing)
        chat = LlmChat(
            api_key=api_key,
            session_id=f"edit_session_{uuid.uuid4()}",
            system_message="""You are an expert Lottie animation JSON editor. You understand Lottie file structure deeply and can make precise modifications.

IMPORTANT INSTRUCTIONS:
1. You will receive a Lottie JSON and a user request
2. Analyze the JSON structure carefully
3. Make the requested changes precisely
4. Return ONLY the modified JSON, no explanations
5. Ensure the JSON remains valid and maintains Lottie structure

Common Lottie modifications:
- Colors: Look for "c" property in shapes/fills/strokes - values are [R,G,B] arrays from 0-1
- Text: Look for "t" property in text layers, modify the "d" property which contains text data
- Numbers/Years: Search throughout the JSON for specific numeric values
- Delete elements: Remove entire layers, shapes, or text elements
- Transforms: Modify "ks" properties for position, scale, rotation

EXAMPLES:
- "change color to blue" → Find fill colors and change "c" values to [0,0,1]
- "replace 2019 with 2018" → Find "2019" in text data and replace with "2018"
- "delete text" → Remove text layers entirely
- "make bigger" → Increase "s" values in transform properties

Remember: Return ONLY valid JSON, no markdown, no explanations."""
        ).with_model("gemini", "gemini-2.0-flash")

        # Create user message with animation data and prompt
        user_message = UserMessage(
            text=f"""Modify this Lottie animation JSON based on the request: "{prompt}"

Here's the current Lottie JSON:
{json.dumps(animation_data, indent=2)}

Return only the modified JSON:"""
        )

        # Send message and get response
        logging.info("Sending request to AI model...")
        response = await chat.send_message(user_message)
        
        logging.info(f"AI response received: {response[:200]}...")
        
        # Try to parse the response as JSON
        try:
            # Clean the response thoroughly
            response_text = response.strip()
            
            # Remove markdown formatting
            if '```json' in response_text:
                start = response_text.find('```json') + 7
                end = response_text.rfind('```')
                if end > start:
                    response_text = response_text[start:end]
            elif '```' in response_text:
                # Handle simple markdown
                response_text = response_text.replace('```', '')
            
            response_text = response_text.strip()
            
            # Parse JSON
            modified_data = json.loads(response_text)
            
            # Validate that it's still a Lottie animation
            if not isinstance(modified_data, dict) or 'v' not in modified_data:
                logging.warning("AI response doesn't look like valid Lottie JSON, returning original")
                return animation_data
            
            logging.info("AI edit successful, returning modified animation")
            return modified_data
            
        except json.JSONDecodeError as e:
            logging.error(f"Failed to parse AI response as JSON: {e}")
            logging.error(f"Response was: {response}")
            
            # Try to make simple modifications based on the prompt if AI fails
            return make_simple_modifications(animation_data, prompt)
            
    except Exception as e:
        logging.error(f"AI editing error: {e}")
        # Try simple modifications as fallback
        return make_simple_modifications(animation_data, prompt)

def make_simple_modifications(animation_data: Dict[str, Any], prompt: str) -> Dict[str, Any]:
    """Make simple modifications when AI fails"""
    try:
        import copy
        modified_data = copy.deepcopy(animation_data)
        prompt_lower = prompt.lower()
        
        logging.info(f"Making simple modifications for prompt: {prompt}")
        
        # Simple color changes
        if 'blue' in prompt_lower and 'color' in prompt_lower:
            # Find and change colors to blue
            def change_colors_to_blue(obj):
                if isinstance(obj, dict):
                    for key, value in obj.items():
                        if key == 'c' and isinstance(value, dict) and 'k' in value:
                            if isinstance(value['k'], list) and len(value['k']) >= 3:
                                value['k'] = [0, 0, 1]  # Blue color
                        elif isinstance(value, (dict, list)):
                            change_colors_to_blue(value)
                elif isinstance(obj, list):
                    for item in obj:
                        change_colors_to_blue(item)
            
            change_colors_to_blue(modified_data)
            logging.info("Applied blue color change")
            
        # Simple number replacement
        elif 'replace' in prompt_lower or 'change' in prompt_lower:
            # Try to find numbers in the prompt
            import re
            numbers = re.findall(r'\d{4}', prompt)  # Find 4-digit years
            if len(numbers) >= 2:
                old_num, new_num = numbers[0], numbers[1]
                # Convert to JSON string and replace
                json_str = json.dumps(modified_data)
                json_str = json_str.replace(old_num, new_num)
                try:
                    modified_data = json.loads(json_str)
                    logging.info(f"Replaced {old_num} with {new_num}")
                except:
                    pass
        
        # Simple size increase
        elif 'bigger' in prompt_lower or 'larger' in prompt_lower:
            def increase_size(obj):
                if isinstance(obj, dict):
                    for key, value in obj.items():
                        if key == 's' and isinstance(value, dict) and 'k' in value:
                            if isinstance(value['k'], list) and len(value['k']) >= 2:
                                value['k'][0] = min(value['k'][0] * 1.2, 200)  # Increase by 20%
                                value['k'][1] = min(value['k'][1] * 1.2, 200)
                        elif isinstance(value, (dict, list)):
                            increase_size(value)
                elif isinstance(obj, list):
                    for item in obj:
                        increase_size(item)
            
            increase_size(modified_data)
            logging.info("Applied size increase")
        
        return modified_data
        
    except Exception as e:
        logging.error(f"Simple modifications failed: {e}")
        return animation_data

# API Routes
@api_router.get("/")
async def root():
    return {"message": "MotionEdit API"}

@api_router.get("/animations", response_model=List[Animation])
async def get_animations():
    """Get all animations"""
    try:
        animations = await db.animations.find().to_list(length=None)
        return [Animation(**parse_from_mongo(anim)) for anim in animations]
    except Exception as e:
        logging.error(f"Error fetching animations: {e}")
        return []

@api_router.post("/animations", response_model=Animation)
async def create_animation(animation: AnimationCreate):
    """Create a new animation"""
    try:
        new_animation = Animation(**animation.dict())
        animation_dict = prepare_for_mongo(new_animation.dict())
        
        await db.animations.insert_one(animation_dict)
        return new_animation
    except Exception as e:
        logging.error(f"Error creating animation: {e}")
        raise HTTPException(status_code=500, detail="Failed to create animation")

@api_router.get("/animations/{animation_id}", response_model=Animation)
async def get_animation(animation_id: str):
    """Get a specific animation"""
    try:
        animation = await db.animations.find_one({"id": animation_id})
        if not animation:
            raise HTTPException(status_code=404, detail="Animation not found")
        return Animation(**parse_from_mongo(animation))
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching animation: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch animation")

@api_router.put("/animations/{animation_id}", response_model=Animation)
async def update_animation(animation_id: str, update_data: AnimationUpdate):
    """Update an animation"""
    try:
        # Get existing animation
        existing = await db.animations.find_one({"id": animation_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Animation not found")
        
        # Prepare update data
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        update_dict["updated_at"] = datetime.now(timezone.utc)
        update_dict = prepare_for_mongo(update_dict)
        
        # Update in database
        await db.animations.update_one(
            {"id": animation_id},
            {"$set": update_dict}
        )
        
        # Return updated animation
        updated = await db.animations.find_one({"id": animation_id})
        return Animation(**parse_from_mongo(updated))
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating animation: {e}")
        raise HTTPException(status_code=500, detail="Failed to update animation")

@api_router.delete("/animations/{animation_id}")
async def delete_animation(animation_id: str):
    """Delete an animation"""
    try:
        result = await db.animations.delete_one({"id": animation_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Animation not found")
        return {"message": "Animation deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting animation: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete animation")

@api_router.post("/animations/edit", response_model=AIEditResponse)
async def edit_animation_with_ai(request: AIEditRequest):
    """Edit animation using AI"""
    try:
        # Process the AI edit request
        modified_data = await process_ai_edit(request.animationData, request.prompt)
        
        # Update the animation in database if needed
        if request.animationId:
            try:
                await db.animations.update_one(
                    {"id": request.animationId},
                    {"$set": {
                        "animationData": modified_data,
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
            except Exception as e:
                logging.warning(f"Failed to update animation in database: {e}")
        
        return AIEditResponse(
            success=True,
            animationData=modified_data,
            message="Animation edited successfully"
        )
    except Exception as e:
        logging.error(f"Error in AI editing: {e}")
        return AIEditResponse(
            success=False,
            animationData=request.animationData,
            message=f"Failed to edit animation: {str(e)}"
        )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)