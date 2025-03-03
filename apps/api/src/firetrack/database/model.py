import re

from sqlalchemy.orm import DeclarativeBase, declared_attr


def slugify_table_name(name: str) -> str:
    names = re.split("(?=[A-Z])", name)
    return "_".join([name.lower() for name in names if name])


class Model(DeclarativeBase):
    @declared_attr
    def __tablename__(self):
        return slugify_table_name(self.__name__)
