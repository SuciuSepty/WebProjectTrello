from pydantic import BaseModel, Field
from typing import List, Optional


# ──────── COMMENT ────────

class CommentCreate(BaseModel):
    text: str = Field(..., min_length=1)
    color: str = "#5e6c84"
    done: bool = False


class CommentOut(BaseModel):
    id: int
    text: str
    color: str
    done: bool
    card_id: int

    model_config = {"from_attributes": True}


# ──────── CARD ────────

class CardCreate(BaseModel):
    title: str = Field(..., min_length=1)
    color: str = "#ffffff"
    done: bool = False


class CardUpdate(BaseModel):
    title: Optional[str] = None
    color: Optional[str] = None
    done: Optional[bool] = None
    list_id: Optional[int] = None
    position: Optional[int] = None


class CardOut(BaseModel):
    id: int
    title: str
    color: str
    done: bool
    position: int
    list_id: int
    comments: List[CommentOut] = []

    model_config = {"from_attributes": True}


# ──────── LIST ────────

class ListCreate(BaseModel):
    name: str = Field(..., min_length=1)
    color: str = "#ebecf0"


class ListOut(BaseModel):
    id: int
    name: str
    color: str
    position: int
    board_id: int
    cards: List[CardOut] = []

    model_config = {"from_attributes": True}


# ──────── BOARD ────────

class BoardCreate(BaseModel):
    name: str = Field(..., min_length=1)
    emoji: str = "📌"
    week: str = Field(..., min_length=1)


class BoardOut(BaseModel):
    id: int
    name: str
    emoji: str
    week: str
    lists: List[ListOut] = []

    model_config = {"from_attributes": True}
