from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from backend import models, schemas
from backend.database import get_db

router = APIRouter()


# BOARDSSSSSSSSSS

@router.get("/boards", response_model=List[schemas.BoardOut])
def get_boards(db: Session = Depends(get_db)):
    return db.query(models.Board).order_by(models.Board.id).all()


@router.post("/boards", response_model=schemas.BoardOut, status_code=201)
def create_board(board: schemas.BoardCreate, db: Session = Depends(get_db)):
    db_board = models.Board(**board.model_dump())
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    print(f"Board week: {db_board.week}")
    return db_board


@router.get("/boards/{board_id}", response_model=schemas.BoardOut)
def get_board(board_id: int, db: Session = Depends(get_db)):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    return board


@router.put("/boards/{board_id}", response_model=schemas.BoardOut)
def update_board(board_id: int, board: schemas.BoardCreate, db: Session = Depends(get_db)):
    db_board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")
    for key, value in board.model_dump().items():
        setattr(db_board, key, value)
    db.commit()
    db.refresh(db_board)
    return db_board


@router.delete("/boards/{board_id}", status_code=204)
def delete_board(board_id: int, db: Session = Depends(get_db)):
    db_board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")
    db.delete(db_board)
    db.commit()


# LISTSSSSSSSSSS

@router.get("/boards/{board_id}/lists", response_model=List[schemas.ListOut])
def get_lists(board_id: int, db: Session = Depends(get_db)):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    return db.query(models.List).filter(models.List.board_id == board_id).order_by(models.List.position).all()


@router.post("/boards/{board_id}/lists", response_model=schemas.ListOut, status_code=201)
def create_list(board_id: int, lst: schemas.ListCreate, db: Session = Depends(get_db)):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    max_pos = db.query(models.List).filter(models.List.board_id == board_id).count()
    db_list = models.List(**lst.model_dump(), board_id=board_id, position=max_pos)
    db.add(db_list)
    db.commit()
    db.refresh(db_list)
    return db_list


@router.put("/lists/{list_id}", response_model=schemas.ListOut)
def update_list(list_id: int, lst: schemas.ListCreate, db: Session = Depends(get_db)):
    db_list = db.query(models.List).filter(models.List.id == list_id).first()
    if not db_list:
        raise HTTPException(status_code=404, detail="List not found")
    for key, value in lst.model_dump().items():
        setattr(db_list, key, value)
    db.commit()
    db.refresh(db_list)
    return db_list


@router.delete("/lists/{list_id}", status_code=204)
def delete_list(list_id: int, db: Session = Depends(get_db)):
    db_list = db.query(models.List).filter(models.List.id == list_id).first()
    if not db_list:
        raise HTTPException(status_code=404, detail="List not found")
    db.delete(db_list)
    db.commit()


# CARDSSSSSSSSSS

@router.get("/lists/{list_id}/cards", response_model=List[schemas.CardOut])
def get_cards(list_id: int, db: Session = Depends(get_db)):
    lst = db.query(models.List).filter(models.List.id == list_id).first()
    if not lst:
        raise HTTPException(status_code=404, detail="List not found")
    return db.query(models.Card).filter(models.Card.list_id == list_id).order_by(models.Card.position).all()


@router.post("/lists/{list_id}/cards", response_model=schemas.CardOut, status_code=201)
def create_card(list_id: int, card: schemas.CardCreate, db: Session = Depends(get_db)):
    lst = db.query(models.List).filter(models.List.id == list_id).first()
    if not lst:
        raise HTTPException(status_code=404, detail="List not found")
    max_pos = db.query(models.Card).filter(models.Card.list_id == list_id).count()
    db_card = models.Card(**card.model_dump(), list_id=list_id, position=max_pos)
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card


@router.get("/cards/{card_id}", response_model=schemas.CardOut)
def get_card(card_id: int, db: Session = Depends(get_db)):
    card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    return card


@router.put("/cards/{card_id}", response_model=schemas.CardOut)
def update_card(card_id: int, card: schemas.CardUpdate, db: Session = Depends(get_db)):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if not db_card:
        raise HTTPException(status_code=404, detail="Card not found")
    for key, value in card.model_dump(exclude_unset=True).items():
        setattr(db_card, key, value)
    db.commit()
    db.refresh(db_card)
    return db_card


@router.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: int, db: Session = Depends(get_db)):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if not db_card:
        raise HTTPException(status_code=404, detail="Card not found")
    db.delete(db_card)
    db.commit()


# COMMENTSSSSSSSSSS

@router.get("/cards/{card_id}/comments", response_model=List[schemas.CommentOut])
def get_comments(card_id: int, db: Session = Depends(get_db)):
    card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    return db.query(models.Comment).filter(models.Comment.card_id == card_id).order_by(models.Comment.id).all()


@router.post("/cards/{card_id}/comments", response_model=schemas.CommentOut, status_code=201)
def create_comment(card_id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    db_comment = models.Comment(**comment.model_dump(), card_id=card_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


@router.delete("/comments/{comment_id}", status_code=204)
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(db_comment)
    db.commit()
