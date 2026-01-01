
# Conference App – Salesforce LWC Assessment

## Overview
Conference App is a Salesforce Lightning application built using **Lightning Web Components (LWC)**, **Apex**, and **Lightning Message Service (LMS)**.

The application allows users to:
- Search speakers by name and speciality
- View speaker details
- Assign speakers to sessions
- Prevent overlapping session assignments
- Visually view booked dates using a custom calendar (Bonus feature)

This solution follows Salesforce best practices by separating UI validation and backend business logic.

---

## Features Implemented

### 1. Speaker Search (Left Panel)
- Search speakers using:
  - Name
  - Speciality
- Displays results in a **lightning-datatable**
- Each row contains a **Book Session** button

---

### 2. Speaker Details (Right Panel)
- Displays selected speaker details:
  - Name
  - Speciality
  - Bio
- Data is received using **Lightning Message Service (LMS)**

---

### 3. Session Booking
- User selects a **future date**
- Clicking **Create Assignment**:
  - Automatically creates a Session if one does not exist
  - Creates a Speaker_Assignment__c record
- Toast messages indicate success or failure

---

### 4. Conflict Handling (Core Requirement)
- A speaker **cannot be assigned to overlapping sessions**
- Implemented using an **Apex Trigger**
- Same date with different time is allowed
- Same date with overlapping time is blocked

The trigger is the final authority for conflict validation.

---


---

## Architecture

