# Cascade Scheduling Demo

### High-level Architecture
![Architecture diagram](./images/high-level-arch.png?raw=true)



### Setup
```bash
# Create few Patients
curl -X POST http://localhost:3000/api/internal/createPatient -H "Content-Type: application/json" -d '{"name":"Patient 50", "identifier":"50"}'

# Create few Practitioners
curl -X POST http://localhost:3000/api/internal/createPractitioner -H "Content-Type: application/json" -d '{"name":"Practitioner 100", "identifier":"100"}'

# Get free slots for practitioner, date-range, patient
curl -X GET http://localhost:3000/api/appointments/free-slots?practitionerIds=179d95a2-dcae-4aa1-b77c-77796ebf8360,64df222a-24c9-4a9b-9fb0-0b4629584163&startDate=2024/07/24 

# Get all patients
curl -X GET http://localhost:3000/api/profiles/patients

# Get patient with cascade identifier
curl -X GET http://localhost:3000/api/profiles/patients?identifier=51 

# Get all practitioners
curl -X GET http://localhost:3000/api/profiles/practitioners 

# Get patient with cascade identifier
curl -X GET http://localhost:3000/api/profiles/practitioners?identifier=101 

# Book an appointment
curl -X POST http://localhost:3000/api/appointments/ -H "Content-Type: application/json" -d '{"patientId":"456", "slotId":"123"}'

# Get appointments or patient / practitioner
curl -X GET http://localhost:3000/api/appointments?patientId=123
curl -X GET http://localhost:3000/api/appointments?practitionerId=123

```