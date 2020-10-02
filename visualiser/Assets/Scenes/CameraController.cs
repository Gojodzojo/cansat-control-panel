using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    private enum Modes {
        Orbit = 0,
        Top = 1,
        Side = 2
    }

    /* https://emmaprats.com/p/how-to-rotate-the-camera-around-an-object-in-unity3d/ */
    [SerializeField] private Camera cam;
    [SerializeField] private Transform target;
    [SerializeField] private float distanceToTarget = 10;
    [SerializeField] private float originalHeight = 1000;
    [SerializeField] private Modes mode = Modes.Side;
    
    private Vector3 previousPosition;
    
    void Update()
    {
        switch (mode)
        {
            case Modes.Top:
                cam.transform.position = new Vector3(0, originalHeight, 0);
                cam.transform.rotation = new Quaternion(1, 0, 0, 1);    
                break;
            case Modes.Orbit:
                orbitMode();
                break;
            case Modes.Side:
                cam.transform.position = new Vector3(0, originalHeight/2, 0);
                cam.transform.rotation = new Quaternion(0, 1, 0, 1);
                break;                
            default:
                Debug.Log("Invalid camera mode");
                break;
        }
    }

    void orbitMode() {
        if (Input.GetAxis("Mouse ScrollWheel") < 0 ) {
            distanceToTarget++;
        }
        else if (Input.GetAxis("Mouse ScrollWheel") > 0 ) {
            distanceToTarget--;
        }

        if(distanceToTarget < 2) {
            distanceToTarget = 2;
        }

        cam.transform.position = target.position;

        if (Input.GetMouseButtonDown(0))
        {
            previousPosition = cam.ScreenToViewportPoint(Input.mousePosition);
        }
        else if (Input.GetMouseButton(0))
        {
            Vector3 newPosition = cam.ScreenToViewportPoint(Input.mousePosition);
            Vector3 direction = previousPosition - newPosition;
            
            float rotationAroundYAxis = -direction.x * 180; // camera moves horizontally
            float rotationAroundXAxis = direction.y * 180; // camera moves vertically                        
            
            cam.transform.Rotate(new Vector3(1, 0, 0), rotationAroundXAxis);
            cam.transform.Rotate(new Vector3(0, 1, 0), rotationAroundYAxis, Space.World); // <— This is what makes it work!                    
            
            previousPosition = newPosition;
        }

        cam.transform.Translate(new Vector3(0, 0, -distanceToTarget));
    }

    public void setMode(int modeNumber) {        
        mode = (Modes) modeNumber;
    }

    public void setOriginalHeight(float newHeight) {
        originalHeight = newHeight;
    }
}
