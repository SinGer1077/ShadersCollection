#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    float formula = length( pa - ba*h ) + 0.24;
    return 1.-smoothstep(formula-(formula*0.01),
                         formula+(formula*0.01),
                         dot(formula,formula)*4.0);
}

vec4 ProjectionResult(vec4 points, float p, float q, float r, float z){
    float proj = p*points.x + q*points.y+r*points.z + 1.;
    return vec4(points.x / proj, points.y / proj, 0., 1.);
}

mat4 TransformMatrix(float m, float n, float k){
    return mat4(1., 0., 0., m, 
                0., 1., 0., n, 
                0., 0., 1., k,
                0., 0., 0., 1.);
}

vec4 ScaleResult(vec4 points, float s){
    return vec4(points.x / s, points.y / s, points.z / s, 1.);
}

mat4 RotationMatrixX(float angle){
    return mat4(1., 0., 0., 0., 
                0., cos(angle), -sin(angle), 0., 
                0., sin(angle), cos(angle), 0.,
                0., 0., 0., 1.);
}

mat4 RotationMatrixY(float angle){
    return mat4(cos(angle), 0., sin(angle), 0., 
                0., 1., 0., 0., 
                -sin(angle), 0., cos(angle), 0.,
                0., 0., 0., 1.);
}

mat4 RotationMatrixZ(float angle){
    return mat4(cos(angle), -sin(angle), 0., 0., 
                sin(angle), cos(angle), 0., 0., 
                0., 0., 1., 0.,
                0., 0., 0., 1.);
}

void main(){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;  
    st.x = gl_FragCoord.x / u_resolution.y;  

    vec3 color = vec3(0.0);    
    
    vec4 points[8];
    points[0] = vec4(-0.2, -0.2, 0.0, 1.0);
    points[1] = vec4(0.2, -0.2, 0.0, 1.0);
    points[2] = vec4(-0.2, 0.2, 0.0, 1.0);
    points[3] = vec4(0.2, 0.2, 0.0, 1.0);
    points[4] = vec4(-0.1, -0.1, -0.4, 1.0);
    points[5] = vec4(-0.1, 0.3, -0.4, 1.0);
    points[6] = vec4(0.3, -0.1, -0.4, 1.0);
    points[7] = vec4(0.3, 0.3, -0.4, 1.0);

    float edges[12];
    

    for (int i = 0; i < 8; i++){          

        //points[i] *= TransformMatrix(0.0, 0.0, sin(u_time) * 0.5);  
        points[i] *= RotationMatrixX(u_time);
        points[i] *= RotationMatrixY(u_time);
        points[i] *= RotationMatrixZ(u_time);
        points[i] *= TransformMatrix(0.5, 0.5, 0.);    
        //points[i] *= ScaleResult(points[i], 1.);
       
        //points[i] *= ProjectionResult(points[i], 0.0, 0.0, 0.0,points[i].z);        
    }

    edges[0] = sdSegment(st, points[0].xy, points[1].xy);
    edges[1] = sdSegment(st, points[0].xy, points[2].xy);
    edges[2] = sdSegment(st, points[1].xy, points[3].xy);
    edges[3] = sdSegment(st, points[2].xy, points[3].xy);

    edges[4] = sdSegment(st, points[4].xy, points[5].xy);
    edges[5] = sdSegment(st, points[4].xy, points[6].xy);
    edges[6] = sdSegment(st, points[5].xy, points[7].xy);
    edges[7] = sdSegment(st, points[6].xy, points[7].xy);

    edges[8] = sdSegment(st, points[0].xy, points[4].xy);
    edges[9] = sdSegment(st, points[1].xy, points[6].xy);
    edges[10] = sdSegment(st, points[2].xy, points[5].xy);
    edges[11] = sdSegment(st, points[3].xy, points[7].xy);

    for (int i = 0; i < 12; i++){
        color += vec3(edges[i]);
    }    
    
    gl_FragColor = vec4(color, 1.0);
}