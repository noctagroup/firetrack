import os
from typing import Dict, List, Optional, Tuple

import pystac_client


class StacService:
    """
    Manipulação do Servidor STAC.
    """

    def __init__(self, server_uri: Optional[str] = None):
        """
        Inicializa a conexão com o STAC Server.

        Args:
            server_uri (Optional[str]): URL do servidor STAC. Se None, usa a variável de ambiente STAC_URI.

        Raises:
            ValueError: Se a URI for inválida ou vazia.
            ConnectionError: Se a conexão com o servidor STAC falhar.
        """
        uri = server_uri if isinstance(server_uri, str) else os.getenv("STAC_URI", "")
        if not isinstance(uri, str) or not uri:
            raise ValueError("STAC URI deve ser uma string válida não vazia.")

        try:
            self.__stac_service = pystac_client.Client.open(uri)
        except Exception as e:
            raise ConnectionError(f"Erro ao conectar ao STAC Server: {str(e)}")

        self.__collections: Dict[str, Optional[List[Dict[str, str]]]] = {"data": None}

    def fetch_collections(self, cached: bool = True) -> Dict[str, List[Dict[str, str]]]:
        """
        Obtém todas as coleções disponíveis no STAC.

        Args:
            cached (bool): Se True, usa o cache interno para evitar múltiplas chamadas.

        Returns:
            Dict[str, List[Dict[str, str]]]: Um dicionário contendo a lista de coleções.

        Raises:
            RuntimeError: Se houver um erro ao buscar as coleções.
        """
        if not cached or self.__collections["data"] is None:
            try:
                self.__collections["data"] = [
                    {"id": collection.id, "desc": collection.description}
                    for collection in self.__stac_service.get_collections()
                ]
            except Exception as e:
                raise RuntimeError(f"Erro ao buscar coleções do STAC: {str(e)}")

        return {"data": self.__collections["data"] or []}

    def get_collection_items(self, collection_id: str) -> dict:
        """
        Obtém os itens de uma coleção específica.

        Args:
            collection_id (str): O ID da coleção.

        Returns:
            dict: Dicionário contendo os itens da coleção.

        Raises:
            ValueError: Se a coleção não for encontrada.
            RuntimeError: Se houver erro ao buscar os itens da coleção.
        """
        try:
            collection = self.__stac_service.get_collection(collection_id)
            if not collection:
                raise ValueError(f"Collection '{collection_id}' não encontrada.")

            items = []
            for item in collection.get_items():
                image = (
                    item.assets["thumbnail"].href
                    if "thumbnail" in item.assets
                    else None
                )
                other_assets = [
                    asset.href
                    for key, asset in item.assets.items()
                    if key != "thumbnail"
                ]

                items.append(
                    {
                        "id": item.id,
                        "datapas": item.datetime.isoformat() if item.datetime else None,
                        "image": image,
                        "bbox": item.bbox,
                        "assets": other_assets,
                    }
                )

            return {"collection": collection_id, "data": items}
        except Exception as e:
            raise RuntimeError(
                f"Erro ao buscar itens da coleção '{collection_id}': {str(e)}"
            )

    def get_collection_items_filtered(
        self,
        bbox: Tuple[float, float, float, float],
        datetime: str,
        collections: List[str],
    ) -> dict:
        """
        Obtém itens filtrados com base em bbox, intervalo de datas e coleções.

        Args:
            bbox (Tuple[float, float, float, float]): Coordenadas (minx, miny, maxx, maxy).
            datetime (str): Intervalo de tempo no formato 'YYYY-MM-DD/YYYY-MM-DD'.
            collections (List[str]): Lista de coleções a serem buscadas.

        Returns:
            List[Dict[str, Any]]: Lista de itens correspondentes aos filtros, com valores formatados.

        Raises:
            RuntimeError: Se houver erro na busca.
        """
        try:
            search_result = self.__stac_service.search(
                bbox=bbox, datetime=datetime, collections=collections
            )

            items = []
            for item in search_result.items():
                image = (
                    item.assets["thumbnail"].href
                    if "thumbnail" in item.assets
                    else None
                )
                other_assets = [
                    asset.href
                    for key, asset in item.assets.items()
                    if key != "thumbnail"
                ]

                items.append(
                    {
                        "id": item.id,
                        "datapas": item.datetime.isoformat() if item.datetime else None,
                        "image": image,
                        "bbox": item.bbox,
                        "assets": other_assets,
                    }
                )

            return {
                "collections": collections,
                "bbox": list(bbox),
                "datetime": datetime,
                "items_found": items,
            }

        except Exception as e:
            raise RuntimeError(f"Erro ao buscar itens filtrados: {str(e)}")
