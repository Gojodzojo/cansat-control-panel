using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Mapbox.Unity.Map;

public class MapController : MonoBehaviour
{
    [SerializeField] private AbstractMap map;

    void setCoordinates(string latLon) {
        map.Initialize(JsonUtility.FromJson<Mapbox.Utils.Vector2d>(latLon), 15);
    }
}
