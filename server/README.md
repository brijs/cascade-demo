# Cascade Scheduling Demo

### High-level Architecture
![Architecture diagram](./images/high-level-arch.png?raw=true)



### Setup
```bash
# Create few Patients
curl -X POST http://localhost:3000/api/internal/createPatient -H "Content-Type: application/json" -d '{"name":"Patient 50", "identifier":"50"}'

# Create few Practitioners
curl -X POST http://localhost:3000/api/internal/createPractitioner -H "Content-Type: application/json" -d '{"name":"Practitioner 100", "identifier":"100"}'

```