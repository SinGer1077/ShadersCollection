#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

mat3 TransformMatrix(float m, float n){
    return mat3(1., 0., m, 
                0., 1., n, 
                0., 0., 1.);
}

mat3 ScaleMatrix(float a, float d){
    return mat3(a, 0., 0, 
                0., d, 0, 
                0., 0., 1);
}

mat3 RotationMatrix(float angle){
    return mat3(cos(angle), -sin(angle), 0.,
                sin(angle), cos(angle), 0,
                0., 0., 1.);
}

float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    float formula = length( pa - ba*h ) + 0.24;
    return 1.-smoothstep(formula-(formula*0.01),
                         formula+(formula*0.01),
                         dot(formula,formula)*4.0);
}

void main(){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;  
    st.x = gl_FragCoord.x / u_resolution.y;  

    vec3 color = vec3(0.0);    
    
    vec3 points[2];
    points[0] = vec3(-0.1, -0.1, 1.0);
    points[1] = vec3(0.1, 0.1, 1.0);
    for (int i = 0; i < 2; i++){   
        points[i] *= ScaleMatrix(sin(u_time),sin(u_time));   
        points[i] *= RotationMatrix(u_time * 1.);     
        points[i] *= TransformMatrix(sin(u_time) * 0.2, cos(u_time) * 0.2);  
        points[i] *= TransformMatrix(0.5, 0.5);          
    }
    color = color + vec3(sdSegment(st, points[0].xy, points[1].xy));
    gl_FragColor = vec4(color, 1.0);
}