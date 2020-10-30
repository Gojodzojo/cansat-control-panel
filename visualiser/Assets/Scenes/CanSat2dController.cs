using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CanSat2dController : MonoBehaviour
{
    [SerializeField] private Camera cam;
    [SerializeField] private float FixedSize;
    [SerializeField] private Canvas CanSat2d;


    void setMarkEnabled(string val) {
        if(val == "true") {
            CanSat2d.enabled = true;
        }
        else {
            CanSat2d.enabled = false;
        }
        
    }

    void Update()
    {        
        //https://stackoverflow.com/a/47744026/14375259
        var distance = (cam.transform.position - transform.position).magnitude;
        var size = distance * FixedSize * cam.fieldOfView;
        transform.localScale = Vector3.one * size;
        transform.forward = transform.position - cam.transform.position;
    }
}
