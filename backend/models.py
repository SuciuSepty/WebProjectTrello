from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    emoji = Column(String, default="📌")
    week: str = Column(String, nullable=False)

    lists = relationship("List", back_populates="board", cascade="all, delete-orphan")


class List(Base):
    __tablename__ = "lists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, default="#ebecf0")
    position = Column(Integer, default=0)
    board_id = Column(Integer, ForeignKey("boards.id"), nullable=False)

    board = relationship("Board", back_populates="lists")
    cards = relationship("Card", back_populates="list", cascade="all, delete-orphan")


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    color = Column(String, default="#ffffff")
    done = Column(Boolean, default=False)
    position = Column(Integer, default=0)
    list_id = Column(Integer, ForeignKey("lists.id"), nullable=False)

    list = relationship("List", back_populates="cards")
    comments = relationship("Comment", back_populates="card", cascade="all, delete-orphan")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    color = Column(String, default="#5e6c84")
    done = Column(Boolean, default=False)
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False)

    card = relationship("Card", back_populates="comments")
