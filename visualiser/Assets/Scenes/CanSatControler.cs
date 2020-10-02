using UnityEngine;

public class CanSatControler : MonoBehaviour
{        
    public void moveCanSat(string newPositionStr) {        
        Vector3 newPositionVec = JsonUtility.FromJson<Vector3>(newPositionStr);
        transform.position = newPositionVec;        
    }

    /*void Update() {
        Vector3 temp = transform.position;
        temp.y -= (float) 0.01;
        transform.position = temp;
    }*/
}
