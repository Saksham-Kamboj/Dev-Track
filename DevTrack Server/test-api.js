// Simple API test script for DevTrack Server
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
let adminToken = '';
let developerToken = '';

// Test admin login
async function testAdminLogin() {
  console.log('\n🔐 Testing Admin Login...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@devtrack.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      adminToken = data.token;
      console.log('✅ Admin login successful');
      console.log('👤 User:', data.user);
    } else {
      console.log('❌ Admin login failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Test creating a developer
async function testCreateDeveloper() {
  console.log('\n👨‍💻 Testing Create Developer...');
  try {
    const response = await fetch(`${BASE_URL}/api/admin/developer`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@devtrack.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Developer created successfully');
      console.log('👤 Developer:', data.developer);
    } else {
      console.log('❌ Create developer failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Test developer login
async function testDeveloperLogin() {
  console.log('\n🔐 Testing Developer Login...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@devtrack.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      developerToken = data.token;
      console.log('✅ Developer login successful');
      console.log('👤 User:', data.user);
    } else {
      console.log('❌ Developer login failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Test creating a task
async function testCreateTask() {
  console.log('\n📝 Testing Create Task...');
  try {
    const response = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${developerToken}`
      },
      body: JSON.stringify({
        title: 'Fix login bug',
        description: 'Fix the authentication issue in the login form',
        status: 'pending'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Task created successfully');
      console.log('📋 Task:', data.task);
    } else {
      console.log('❌ Create task failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Test getting dashboard stats
async function testDashboard() {
  console.log('\n📊 Testing Admin Dashboard...');
  try {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { 
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Dashboard data retrieved');
      console.log('📈 Stats:', data.stats);
    } else {
      console.log('❌ Dashboard failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting DevTrack API Tests...');
  
  await testAdminLogin();
  await testCreateDeveloper();
  await testDeveloperLogin();
  await testCreateTask();
  await testDashboard();
  
  console.log('\n✨ Tests completed!');
}

runTests();
