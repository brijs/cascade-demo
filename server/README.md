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
curl -X GET http://localhost:3000/api/appointments/free-slots -H "Content-Type: application/json" -d '{"name":"Practitioner 100", "identifier":"100"}'

# Get all patients
curl -X GET http://localhost:3000/api/profiles/patients -H "Content-Type: application/json"

# Get patient with cascade identifier
curl -X GET http://localhost:3000/api/profiles/patients?identifier=51 -H "Content-Type: application/json"

# Get all practitioners
curl -X GET http://localhost:3000/api/profiles/practitioners -H "Content-Type: application/json"

# Get patient with cascade identifier
curl -X GET http://localhost:3000/api/profiles/practitioners?identifier=101 -H "Content-Type: application/json"

```