"""District metadata and normalization service for all 33 Telangana districts."""
import json
import re
from typing import Dict, List, Optional
from .config import GEOJSON_PATH

# 33 Authoritative Districts with verified coordinates inside Telangana boundaries
DISTRICT_METADATA_CONFIG = [
    {
        "id": "hyderabad",
        "name": "Hyderabad",
        "geojson_name": "Hyderabad",
        "dtcode": "536",
        "lat": 17.3850,
        "lon": 78.4867,
        "elevation": 542.0,
        "area_km2": 217.0,
        "aliases": ["hyderabad", "hyd", "hyderabad central"]
    },
    {
        "id": "adilabad",
        "name": "Adilabad",
        "geojson_name": "Adilabad",
        "dtcode": "532",
        "lat": 19.6641,
        "lon": 78.5320,
        "elevation": 264.0,
        "area_km2": 4153.0,
        "aliases": ["adilabad", "adb"]
    },
    {
        "id": "bhadradri_kothagudem",
        "name": "Bhadradri Kothagudem",
        "geojson_name": "Bhadradri Kothagudem",
        "dtcode": "748",
        "lat": 17.5500,
        "lon": 80.6167,
        "elevation": 89.0,
        "area_km2": 7483.0,
        "aliases": ["bhadradri", "kothagudem", "bhadradri kothagudem", "bhadradri-kothagudem"]
    },
    {
        "id": "jagitial",
        "name": "Jagitial",
        "geojson_name": "Jagitial",
        "dtcode": "737",
        "lat": 18.7900,
        "lon": 78.9100,
        "elevation": 264.0,
        "area_km2": 2419.0,
        "aliases": ["jagitial", "jagtial"]
    },
    {
        "id": "jangoan",
        "name": "Jangaon",
        "geojson_name": "Jangoan",
        "dtcode": "752",
        "lat": 17.7200,
        "lon": 79.1800,
        "elevation": 382.0,
        "area_km2": 2188.0,
        "aliases": ["jangoan", "jangaon"]
    },
    {
        "id": "jayashankar",
        "name": "Jayashankar Bhupalpally",
        "geojson_name": "Jayashankar",
        "dtcode": "747",
        "lat": 18.4300,
        "lon": 79.8600,
        "elevation": 180.0,
        "area_km2": 2293.0,
        "aliases": ["jayashankar", "bhupalpally", "jayashankar bhupalpally", "jayashankar-bhupalpally"]
    },
    {
        "id": "jogulamba_gadwal",
        "name": "Jogulamba Gadwal",
        "geojson_name": "Jogulamba Gadwal",
        "dtcode": "761",
        "lat": 16.2300,
        "lon": 77.8000,
        "elevation": 325.0,
        "area_km2": 2928.0,
        "aliases": ["jogulamba", "gadwal", "jogulamba gadwal", "jogulamba-gadwal"]
    },
    {
        "id": "kamareddy",
        "name": "Kamareddy",
        "geojson_name": "Kamareddy",
        "dtcode": "742",
        "lat": 18.3200,
        "lon": 78.3400,
        "elevation": 495.0,
        "area_km2": 3652.0,
        "aliases": ["kamareddy"]
    },
    {
        "id": "karimnagar",
        "name": "Karimnagar",
        "geojson_name": "Karimnagar",
        "dtcode": "534",
        "lat": 18.4386,
        "lon": 79.1288,
        "elevation": 265.0,
        "area_km2": 2128.0,
        "aliases": ["karimnagar", "knr"]
    },
    {
        "id": "khammam",
        "name": "Khammam",
        "geojson_name": "Khammam",
        "dtcode": "540",
        "lat": 17.2473,
        "lon": 80.1514,
        "elevation": 107.0,
        "area_km2": 4361.0,
        "aliases": ["khammam", "kmm"]
    },
    {
        "id": "kumuram_bheem_asifabad",
        "name": "Kumuram Bheem Asifabad",
        "geojson_name": "Kumuram Bheem Asifabad",
        "dtcode": "735",
        "lat": 19.3600,
        "lon": 79.2900,
        "elevation": 218.0,
        "area_km2": 4878.0,
        "aliases": ["kumuram bheem asifabad", "komaram bheem", "komaram bheem asifabad", "asifabad", "komaram_bheem"]
    },
    {
        "id": "mahabubabad",
        "name": "Mahabubabad",
        "geojson_name": "Mahabubabad",
        "dtcode": "750",
        "lat": 17.6000,
        "lon": 80.0000,
        "elevation": 177.0,
        "area_km2": 2877.0,
        "aliases": ["mahabubabad", "mbad"]
    },
    {
        "id": "mahabubnagar",
        "name": "Mahabubnagar",
        "geojson_name": "Mahabubnagar",
        "dtcode": "537",
        "lat": 16.7488,
        "lon": 77.9845,
        "elevation": 498.0,
        "area_km2": 5285.0,
        "aliases": ["mahabubnagar", "mbnr"]
    },
    {
        "id": "mancherial",
        "name": "Mancherial",
        "geojson_name": "Mancherial",
        "dtcode": "736",
        "lat": 18.8700,
        "lon": 79.4600,
        "elevation": 154.0,
        "area_km2": 4016.0,
        "aliases": ["mancherial", "mncl"]
    },
    {
        "id": "medak",
        "name": "Medak",
        "geojson_name": "Medak",
        "dtcode": "535",
        "lat": 18.0400,
        "lon": 78.2600,
        "elevation": 442.0,
        "area_km2": 2786.0,
        "aliases": ["medak"]
    },
    {
        "id": "medchal_malkajgiri",
        "name": "Medchal Malkajgiri",
        "geojson_name": "Medchal Malkajgiri",
        "dtcode": "744",
        "lat": 17.6300,
        "lon": 78.4800,
        "elevation": 560.0,
        "area_km2": 1084.0,
        "aliases": ["medchal", "malkajgiri", "medchal-malkajgiri", "medchal malkajgiri"]
    },
    {
        "id": "mulugu",
        "name": "Mulugu",
        "geojson_name": "Mulugu",
        "dtcode": "780",
        "lat": 18.1900,
        "lon": 79.9400,
        "elevation": 182.0,
        "area_km2": 3881.0,
        "aliases": ["mulugu"]
    },
    {
        "id": "nagarkurnool",
        "name": "Nagarkurnool",
        "geojson_name": "Nagarkurnool",
        "dtcode": "759",
        "lat": 16.4800,
        "lon": 78.3300,
        "elevation": 458.0,
        "area_km2": 6545.0,
        "aliases": ["nagarkurnool", "ngkl"]
    },
    {
        "id": "nalgonda",
        "name": "Nalgonda",
        "geojson_name": "Nalgonda",
        "dtcode": "538",
        "lat": 17.0575,
        "lon": 79.2684,
        "elevation": 421.0,
        "area_km2": 7122.0,
        "aliases": ["nalgonda", "nlg"]
    },
    {
        "id": "narayanpet",
        "name": "Narayanpet",
        "geojson_name": "Narayanpet",
        "dtcode": "781",
        "lat": 16.7300,
        "lon": 77.5000,
        "elevation": 431.0,
        "area_km2": 2336.0,
        "aliases": ["narayanpet"]
    },
    {
        "id": "nirmal",
        "name": "Nirmal",
        "geojson_name": "Nirmal",
        "dtcode": "734",
        "lat": 19.0900,
        "lon": 78.3400,
        "elevation": 340.0,
        "area_km2": 3845.0,
        "aliases": ["nirmal"]
    },
    {
        "id": "nizamabad",
        "name": "Nizamabad",
        "geojson_name": "Nizamabad",
        "dtcode": "533",
        "lat": 18.6725,
        "lon": 78.0941,
        "elevation": 395.0,
        "area_km2": 4288.0,
        "aliases": ["nizamabad", "nzb"]
    },
    {
        "id": "peddapalli",
        "name": "Peddapalli",
        "geojson_name": "Peddapalli",
        "dtcode": "738",
        "lat": 18.6100,
        "lon": 79.3800,
        "elevation": 154.0,
        "area_km2": 2236.0,
        "aliases": ["peddapalli", "pdp"]
    },
    {
        "id": "rajanna_sircilla",
        "name": "Rajanna Sircilla",
        "geojson_name": "Rajanna Sircilla",
        "dtcode": "740",
        "lat": 18.3800,
        "lon": 78.8300,
        "elevation": 320.0,
        "area_km2": 2019.0,
        "aliases": ["rajanna", "sircilla", "rajanna sircilla", "rajanna-sircilla"]
    },
    {
        "id": "ranga_reddy",
        "name": "Ranga Reddy",
        "geojson_name": "Ranga Reddy",
        "dtcode": "539",
        "lat": 17.2000,
        "lon": 78.4000,
        "elevation": 535.0,
        "area_km2": 5031.0,
        "aliases": ["ranga reddy", "rangareddy", "rr"]
    },
    {
        "id": "sangareddy",
        "name": "Sangareddy",
        "geojson_name": "Sangareddy",
        "dtcode": "743",
        "lat": 17.6190,
        "lon": 78.0816,
        "elevation": 496.0,
        "area_km2": 4464.0,
        "aliases": ["sangareddy", "srd"]
    },
    {
        "id": "siddipet",
        "name": "Siddipet",
        "geojson_name": "Siddipet",
        "dtcode": "745",
        "lat": 18.1000,
        "lon": 78.8500,
        "elevation": 475.0,
        "area_km2": 3632.0,
        "aliases": ["siddipet"]
    },
    {
        "id": "suryapet",
        "name": "Suryapet",
        "geojson_name": "Suryapet",
        "dtcode": "756",
        "lat": 17.1400,
        "lon": 79.6200,
        "elevation": 185.0,
        "area_km2": 3609.0,
        "aliases": ["suryapet"]
    },
    {
        "id": "vikarabad",
        "name": "Vikarabad",
        "geojson_name": "Vikarabad",
        "dtcode": "746",
        "lat": 17.3300,
        "lon": 77.9000,
        "elevation": 620.0,
        "area_km2": 3386.0,
        "aliases": ["vikarabad"]
    },
    {
        "id": "wanaparthy",
        "name": "Wanaparthy",
        "geojson_name": "Wanaparthy",
        "dtcode": "760",
        "lat": 16.3600,
        "lon": 78.0600,
        "elevation": 360.0,
        "area_km2": 2152.0,
        "aliases": ["wanaparthy"]
    },
    {
        "id": "warangal_rural",
        "name": "Warangal Rural",
        "geojson_name": "Warangal Rural",
        "dtcode": "749",
        "lat": 17.8500,
        "lon": 79.6500,
        "elevation": 260.0,
        "area_km2": 2175.0,
        "aliases": ["warangal rural", "warangal_rural"]
    },
    {
        "id": "warangal_urban",
        "name": "Warangal Urban",
        "geojson_name": "Warangal Urban",
        "dtcode": "751",
        "lat": 18.0000,
        "lon": 79.5800,
        "elevation": 270.0,
        "area_km2": 1309.0,
        "aliases": ["warangal", "warangal urban", "hanamkonda", "warangal_urban"]
    },
    {
        "id": "yadadri_bhuvanagiri",
        "name": "Yadadri Bhuvanagiri",
        "geojson_name": "Yadadri Bhuvanagiri",
        "dtcode": "754",
        "lat": 17.5100,
        "lon": 78.8800,
        "elevation": 358.0,
        "area_km2": 3092.0,
        "aliases": ["yadadri", "bhuvanagiri", "yadadri bhuvanagiri", "yadadri-bhuvanagiri"]
    }
]

# Quick Lookup Dictionaries
_BY_ID: Dict[str, dict] = {d["id"]: d for d in DISTRICT_METADATA_CONFIG}
_BY_GEOJSON_NAME: Dict[str, dict] = {d["geojson_name"].lower(): d for d in DISTRICT_METADATA_CONFIG}


def _clean_str(s: str) -> str:
    """Normalize string by removing special characters, hyphens, underscores and extra spaces."""
    s = s.lower().strip()
    s = re.sub(r'[\-_/]', ' ', s)
    s = re.sub(r'\s+', ' ', s)
    return s.strip()


def normalize_district_id(identifier_or_name: str) -> str:
    """
    Robust district normalization mapping any variation in spaces, casing,
    hyphens, abbreviations, or spelling variants to the canonical district ID.
    Always falls back gracefully to 'hyderabad' if unmatched.
    """
    if not identifier_or_name:
        return "hyderabad"

    raw = identifier_or_name.strip()
    clean = _clean_str(raw)
    slug = clean.replace(' ', '_')

    # Handle statewide / all districts selection
    if clean in ("all", "all districts", "state", "telangana", "all_districts"):
        return "hyderabad"

    # Direct match on canonical id
    if slug in _BY_ID:
        return slug

    # Match by geojson name
    if clean in _BY_GEOJSON_NAME:
        return _BY_GEOJSON_NAME[clean]["id"]

    # Match through aliases
    for d in DISTRICT_METADATA_CONFIG:
        for alias in d["aliases"]:
            clean_alias = _clean_str(alias)
            if clean == clean_alias or slug == clean_alias.replace(' ', '_'):
                return d["id"]

    # Partial substring match as last resort
    for d in DISTRICT_METADATA_CONFIG:
        if d["id"] in slug or clean in _clean_str(d["name"]):
            return d["id"]

    return "hyderabad"


def get_district_by_id(district_id: str) -> dict:
    """Get district metadata for canonical or normalized id."""
    canonical_id = normalize_district_id(district_id)
    return _BY_ID.get(canonical_id, _BY_ID["hyderabad"])


def get_all_districts() -> List[dict]:
    """Return metadata for all 33 Telangana districts."""
    return DISTRICT_METADATA_CONFIG


def verify_geojson_sync() -> bool:
    """Verify that all 33 districts in this service match public/telangana.geojson."""
    if not GEOJSON_PATH.exists():
        return False
    with open(GEOJSON_PATH, "r", encoding="utf-8") as f:
        geo = json.load(f)
    geo_names = {f["properties"]["name"] for f in geo.get("features", [])}
    our_names = {d["geojson_name"] for d in DISTRICT_METADATA_CONFIG}
    return geo_names == our_names

