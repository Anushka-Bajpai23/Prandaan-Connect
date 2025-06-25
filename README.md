PranDaan Connect

PranDaan Connect is a web-based organ donation matching system that visualizes real-time donor-recipient matches. It includes client-side AI functionality using TensorFlow.js to predict compatibility scores based on factors like age difference, urgency, and organ type.

## Features

- Donor and recipient registration pages
- Live matches dashboard with urgency indicators
- Compatibility scores predicted using a local ML model
- Auto-refresh every 30 seconds
- Responsive and accessible UI

## Tech Stack

- HTML, CSS, JavaScript
- TensorFlow.js for client-side ML predictions

## AI Logic

The compatibility prediction model is trained in-browser using TensorFlow.js. It takes three inputs:
- Age difference
- Urgency level (mapped to score)
- Organ match flag (1 if matching organ)

Predicted score is scaled to 0–100% and used for visualization only.

#Screenshots for reference
![image](https://github.com/user-attachments/assets/fbde29af-8e10-4bb8-ad3d-0fac0e6bd2ed)
![image](https://github.com/user-attachments/assets/e40de14f-ce83-4d89-abec-321883949750)


