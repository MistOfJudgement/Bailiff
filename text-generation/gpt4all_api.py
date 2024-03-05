from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from gpt4all import GPT4All

model = GPT4All("mistral-7b-openorca.Q4_0.gguf")
app = FastAPI()
origins = [
    "http://localhost:8080",
    'http://localhost:3000',
    "http://localhost:8000",
    "http://localhost"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/generate")
def generate(prompt: str):
    if prompt == "":
        return "Prompt cannot be empty"
    return model.generate(prompt)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

