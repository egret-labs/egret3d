precision highp float;
attribute vec4 _glesVertex;    

uniform highp mat4 glstate_matrix_mvp;      
            
void main()                                     
{        
    gl_Position = (glstate_matrix_mvp * _glesVertex);  
}