import requests
import sys
import json
from datetime import datetime

class MotionEditAPITester:
    def __init__(self, base_url="https://promptmotion-3.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.created_animation_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else f"{self.api_url}/"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 500:
                        print(f"   Response: {response_data}")
                    elif isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_get_animations_empty(self):
        """Test getting animations (initially empty)"""
        return self.run_test("Get All Animations", "GET", "animations", 200)

    def test_create_animation(self):
        """Test creating a new animation"""
        # Sample Lottie data (simplified)
        sample_animation_data = {
            "v": "5.5.7",
            "fr": 24,
            "ip": 0,
            "op": 60,
            "w": 298,
            "h": 304,
            "nm": "Sample Animation",
            "ddd": 0,
            "assets": [],
            "layers": [
                {
                    "ddd": 0,
                    "ind": 1,
                    "ty": 4,
                    "nm": "Shape Layer 1",
                    "sr": 1,
                    "ks": {
                        "o": {"a": 0, "k": 100},
                        "r": {"a": 0, "k": 0},
                        "p": {"a": 0, "k": [149, 152, 0]},
                        "a": {"a": 0, "k": [0, 0, 0]},
                        "s": {"a": 0, "k": [100, 100, 100]}
                    },
                    "ao": 0,
                    "shapes": [],
                    "ip": 0,
                    "op": 60,
                    "st": 0,
                    "bm": 0
                }
            ]
        }
        
        animation_data = {
            "name": f"Test Animation {datetime.now().strftime('%H%M%S')}",
            "url": "https://lottie.host/04d4df15-8ce7-44cd-ba10-26887e7da660/yxw7R5qwgE.json",
            "animationData": sample_animation_data
        }
        
        success, response = self.run_test("Create Animation", "POST", "animations", 201, animation_data)
        if success and 'id' in response:
            self.created_animation_id = response['id']
            print(f"   Created animation ID: {self.created_animation_id}")
        return success

    def test_get_specific_animation(self):
        """Test getting a specific animation"""
        if not self.created_animation_id:
            print("❌ Skipped - No animation ID available")
            return False
        
        return self.run_test(
            "Get Specific Animation", 
            "GET", 
            f"animations/{self.created_animation_id}", 
            200
        )[0]

    def test_update_animation(self):
        """Test updating an animation"""
        if not self.created_animation_id:
            print("❌ Skipped - No animation ID available")
            return False
        
        update_data = {
            "name": "Updated Test Animation",
            "settings": {"speed": 1.5, "size": 120}
        }
        
        return self.run_test(
            "Update Animation", 
            "PUT", 
            f"animations/{self.created_animation_id}", 
            200, 
            update_data
        )[0]

    def test_ai_edit_animation(self):
        """Test AI editing functionality"""
        if not self.created_animation_id:
            print("❌ Skipped - No animation ID available")
            return False
        
        # Simple animation data for AI editing
        simple_animation_data = {
            "v": "5.5.7",
            "fr": 24,
            "ip": 0,
            "op": 60,
            "w": 298,
            "h": 304,
            "nm": "AI Test Animation",
            "layers": []
        }
        
        ai_request = {
            "animationData": simple_animation_data,
            "prompt": "make it bigger",
            "animationId": self.created_animation_id
        }
        
        print("   Note: AI editing may take a few seconds...")
        return self.run_test("AI Edit Animation", "POST", "animations/edit", 200, ai_request)[0]

    def test_get_animations_with_data(self):
        """Test getting animations after creating some"""
        success, response = self.run_test("Get All Animations (with data)", "GET", "animations", 200)
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} animations")
        return success

    def test_delete_animation(self):
        """Test deleting an animation"""
        if not self.created_animation_id:
            print("❌ Skipped - No animation ID available")
            return False
        
        return self.run_test(
            "Delete Animation", 
            "DELETE", 
            f"animations/{self.created_animation_id}", 
            200
        )[0]

    def test_get_deleted_animation(self):
        """Test getting a deleted animation (should fail)"""
        if not self.created_animation_id:
            print("❌ Skipped - No animation ID available")
            return False
        
        success, _ = self.run_test(
            "Get Deleted Animation", 
            "GET", 
            f"animations/{self.created_animation_id}", 
            404
        )
        return success

def main():
    print("🚀 Starting MotionEdit API Tests")
    print("=" * 50)
    
    tester = MotionEditAPITester()
    
    # Run all tests in sequence
    test_methods = [
        tester.test_root_endpoint,
        tester.test_get_animations_empty,
        tester.test_create_animation,
        tester.test_get_specific_animation,
        tester.test_update_animation,
        tester.test_get_animations_with_data,
        tester.test_ai_edit_animation,
        tester.test_delete_animation,
        tester.test_get_deleted_animation
    ]
    
    for test_method in test_methods:
        try:
            test_method()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())