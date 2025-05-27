class InvalidDateFormat(Exception):
    pass


class InvalidDateRange(Exception):
    pass


class ProductNotFoundError(Exception):
    def __init__(self, product_id: str):
        super().__init__(f"Produto com ID '{product_id}' não encontrado.")
        self.product_id = product_id


class NoCandidatesError(Exception):
    def __init__(self, fenomeno_id: str):
        super().__init__(
            f"Nenhum candidato encontrado para o fenômeno com ID '{fenomeno_id}'."
        )
        self.fenomeno_id = fenomeno_id
