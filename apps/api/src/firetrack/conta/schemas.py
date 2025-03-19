from pydantic import BaseModel


# TODO: refazer com django forms
class ContaEntrarIn(BaseModel):
    query: str
    password: str
