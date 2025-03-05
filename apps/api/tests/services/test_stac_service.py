import os
from unittest.mock import MagicMock, patch

import pytest

from firetrack.services.stac_service import (
    StacService,
)


@pytest.fixture
def mock_stac_client():
    """
    Mock the pystac_client.Client to prevent real API calls.
    """
    with patch("pystac_client.Client.open") as mock_client:
        mock_instance = MagicMock()
        mock_client.return_value = mock_instance
        yield mock_instance


def test_stac_service_initialization_with_valid_uri(mock_stac_client):
    """
    Test initialization with a valid URI.
    """
    service = StacService(server_uri="https://mock-stac-server.com")
    assert service is not None


def test_stac_service_initialization_with_env_variable(mock_stac_client):
    """
    Test initialization with the STAC_URI environment variable.
    """
    os.environ["STAC_URI"] = "https://mock-stac-server.com"
    service = StacService()
    assert service is not None
    del os.environ["STAC_URI"]


def test_stac_service_initialization_with_invalid_uri():
    """
    Test that ValueError is raised when an invalid URI is provided.
    """
    with pytest.raises(ValueError, match="STAC URI deve ser uma string válida não vazia."):
        StacService(server_uri="")


def test_stac_service_connection_failure():
    """
    Test that ConnectionError is raised when the STAC server fails to connect.
    """
    with patch("pystac_client.Client.open", side_effect=Exception("Connection failed")):
        with pytest.raises(ConnectionError, match="Erro ao conectar ao STAC Server: Connection failed"):
            StacService(server_uri="https://invalid-url.com")


def test_fetch_collections(mock_stac_client):
    """
    Test fetching collections from the STAC service.
    """
    mock_stac_client.get_collections.return_value = [
        MagicMock(id="collection1", description="Test Collection 1"),
        MagicMock(id="collection2", description="Test Collection 2"),
    ]

    service = StacService(server_uri="https://mock-stac-server.com")
    result = service.fetch_collections()

    assert result == {
        "data": [
            {"id": "collection1", "desc": "Test Collection 1"},
            {"id": "collection2", "desc": "Test Collection 2"}
        ]
    }


def test_get_collection_items(mock_stac_client):
    """
    Test retrieving items from a specific STAC collection.
    """
    mock_collection = MagicMock()
    mock_collection.get_items.return_value = [
        MagicMock(
            id="item1",
            datetime="2024-02-19T14:06:00Z",
            assets={
                "thumbnail": MagicMock(href="https://mock-stac.com/image1.png"),
                "data": MagicMock(href="https://mock-stac.com/data1.tif"),
            },
            bbox=[-66.1, -13.8, -56.6, -5.6],
        )
    ]
    
    mock_stac_client.get_collection.return_value = mock_collection

    service = StacService(server_uri="https://mock-stac-server.com")
    result = service.get_collection_items("mock-collection")

    expected = {
        "collection": "mock-collection",
        "data": [
            {
                "id": "item1",
                "datapas": "2024-02-19T14:06:00Z",
                "image": "https://mock-stac.com/image1.png",
                "bbox": [-66.1, -13.8, -56.6, -5.6],
                "assets": ["https://mock-stac.com/data1.tif"]
            }
        ]
    }

    assert result == expected


def test_get_collection_items_filtered(mock_stac_client):
    """
    Test filtering items from a STAC service.
    """
    mock_search = MagicMock()
    mock_search.items.return_value = [
        MagicMock(
            id="item1",
            datetime="2024-02-19T14:06:00Z",
            assets={
                "thumbnail": MagicMock(href="https://mock-stac.com/image1.png"),
                "data": MagicMock(href="https://mock-stac.com/data1.tif"),
            },
            bbox=[-66.1, -13.8, -56.6, -5.6],
        )
    ]
    
    mock_stac_client.search.return_value = mock_search

    service = StacService(server_uri="https://mock-stac-server.com")
    result = service.get_collection_items_filtered(
        bbox=(-61.79, -9.03, -61.70, -8.93),
        datetime="2018-08-01/2019-07-31",
        collections=["S2-16D-2"]
    )

    expected = {
        "collections": ["S2-16D-2"],
        "bbox": [-61.79, -9.03, -61.70, -8.93],
        "datetime": "2018-08-01/2019-07-31",
        "items_found": [
            {
                "id": "item1",
                "datapas": "2024-02-19T14:06:00Z",
                "image": "https://mock-stac.com/image1.png",
                "bbox": [-66.1, -13.8, -56.6, -5.6],
                "assets": ["https://mock-stac.com/data1.tif"]
            }
        ]
    }

    assert result == expected
