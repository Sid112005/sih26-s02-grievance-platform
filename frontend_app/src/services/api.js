// JanSeva AI - Mock API Layer (Future FastAPI Integration)
import { DEMO_USER, INITIAL_COMPLAINTS, INITIAL_NOTIFICATIONS } from '../data/mockData';

// Helper to access persistent localStorage complaints
const getStoredComplaints = () => {
  try {
    const data = localStorage.getItem('janseva_complaints');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse stored complaints", e);
  }
  localStorage.setItem('janseva_complaints', JSON.stringify(INITIAL_COMPLAINTS));
  return INITIAL_COMPLAINTS;
};

const saveStoredComplaints = (complaints) => {
  localStorage.setItem('janseva_complaints', JSON.stringify(complaints));
};

const getStoredNotifications = () => {
  try {
    const data = localStorage.getItem('janseva_notifications');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse notifications", e);
  }
  localStorage.setItem('janseva_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
  return INITIAL_NOTIFICATIONS;
};

// 1. Citizen Login
export const loginCitizen = async (mobile, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mobile === '9876543210' && password === 'demo123') {
        localStorage.setItem('janseva_user', JSON.stringify(DEMO_USER));
        resolve({ success: true, user: DEMO_USER });
      } else {
        reject(new Error('Invalid mobile number or password.'));
      }
    }, 400);
  });
};

// 2. Register Citizen
export const registerCitizen = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        id: `usr_${Math.floor(10000 + Math.random() * 90000)}`,
        name: userData.name || 'Citizen User',
        mobile: userData.mobile,
        email: userData.email || '',
        role: 'CITIZEN'
      };
      localStorage.setItem('janseva_user', JSON.stringify(newUser));
      resolve({ success: true, user: newUser });
    }, 400);
  });
};

// 3. Submit Complaint
export const submitComplaint = async (rawComplaint) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const complaints = getStoredComplaints();
      const nextNum = Math.floor(8950 + Math.random() * 100);
      const complaintId = `GRV-2026-${nextNum}`;

      // Simulate AI categorization based on description keywords
      const desc = (rawComplaint.description || '').toLowerCase();
      let category = "Public Infrastructure";
      let department = "Municipal Corporation";
      let priorityScore = 7.5;
      let urgency = "MEDIUM";

      if (desc.includes('water') || desc.includes('leak') || desc.includes('pipe') || desc.includes('sewage')) {
        category = "Water Supply & Sanitation";
        department = "Municipal Corporation";
        priorityScore = 8.8;
        urgency = "HIGH";
      } else if (desc.includes('light') || desc.includes('electric') || desc.includes('power') || desc.includes('dark')) {
        category = "Electricity & Power";
        department = "Municipal Electrical Dept";
        priorityScore = 6.5;
        urgency = "MEDIUM";
      } else if (desc.includes('pothole') || desc.includes('road') || desc.includes('traffic') || desc.includes('bridge')) {
        category = "Public Infrastructure";
        department = "Municipal Corporation";
        priorityScore = 8.5;
        urgency = "HIGH";
      } else if (desc.includes('garbage') || desc.includes('waste') || desc.includes('trash') || desc.includes('odor')) {
        category = "Public Health & Sanitation";
        department = "Sanitation Department";
        priorityScore = 8.1;
        urgency = "HIGH";
      }

      const newComplaint = {
        complaint_id: complaintId,
        citizen_id: rawComplaint.citizen_id || DEMO_USER.id,
        title: rawComplaint.description.length > 55 
          ? `${rawComplaint.description.substring(0, 55)}...` 
          : rawComplaint.description,
        description: rawComplaint.description,
        location: rawComplaint.location || {
          lat: 19.1834,
          lng: 72.9633,
          address_context: "Main St, near local area"
        },
        category,
        department,
        priority_score: priorityScore,
        urgency,
        status: "IN_PROGRESS",
        assigned_officer: "Zonal Officer (Zone 3)",
        duplicate_detection: {
          is_duplicate: true,
          cluster_id: `cluster_${category.slice(0, 4).toLowerCase()}_${Math.floor(10 + Math.random() * 90)}`,
          similarity_score: 0.92,
          similar_count: 4
        },
        image: rawComplaint.image || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updated = [newComplaint, ...complaints];
      saveStoredComplaints(updated);

      // Add automated notification
      const notifs = getStoredNotifications();
      const newNotif = {
        id: `notif_${Date.now()}`,
        complaint_id: complaintId,
        message: `Your complaint ${complaintId} has been categorized as ${category} and routed to ${department}.`,
        time: "Just now",
        read: false,
        type: "ASSIGNMENT"
      };
      localStorage.setItem('janseva_notifications', JSON.stringify([newNotif, ...notifs]));

      resolve({ success: true, complaint: newComplaint });
    }, 500);
  });
};

// 4. Get My Complaints
export const getMyComplaints = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const complaints = getStoredComplaints();
      resolve(complaints);
    }, 200);
  });
};

// 5. Get Complaint By ID
export const getComplaintById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const complaints = getStoredComplaints();
      const found = complaints.find(c => c.complaint_id === id);
      if (found) {
        resolve(found);
      } else {
        // Fallback demo complaint if exact ID not found
        resolve({
          complaint_id: id,
          citizen_id: DEMO_USER.id,
          title: "Public issue report",
          description: "Civic issue submitted via JanSeva AI citizen portal.",
          location: { lat: 19.1834, lng: 72.9633, address_context: "Main Ward Area" },
          category: "Public Infrastructure",
          department: "Municipal Corporation",
          priority_score: 8.5,
          urgency: "HIGH",
          status: "IN_PROGRESS",
          assigned_officer: "Duty Officer",
          duplicate_detection: { is_duplicate: true, cluster_id: "cluster_001", similarity_score: 0.92, similar_count: 4 },
          image: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }, 200);
  });
};

// 6. Get Notifications
export const getNotifications = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notifs = getStoredNotifications();
      resolve(notifs);
    }, 150);
  });
};
