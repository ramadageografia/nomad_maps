from fastapi import APIRouter
from typing import List

router = APIRouter(prefix="/festivals")

# MOCK inicial (depois vira banco)
festivals = [
    {
        "id": 1,
        "name": "Boom Festival",
        "country": "Portugal",
        "lat": 39.78,
        "lon": -7.45,
        "genre": "Full On",
        "status": "Ativo"
    }
]

@router.get("/")
def get_festivals():
    return festivals