from typing import Generator

import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient

load_dotenv(dotenv_path="backend/credentials.env")  # pass in the abspath to the env file

from src.main import app


@pytest.fixture(scope="function")
def client() -> Generator:
    """
    Create a test client for the FastAPI app.
    """
    with TestClient(app) as c:
        yield c


@pytest.fixture
def context():
    """
    Variable to store context data between steps.
    Note: remember to always return the context variable at the end of the each steps.
    """
    b = {}
    yield b