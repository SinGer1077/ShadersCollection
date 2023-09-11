#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float HexDist(vec2 st){
    st = abs(st);
    float c = dot(st, normalize(vec2(1., 1.73)));
    c = max(c, st.x);
    return c;
}

vec4 HexCoords(vec2 st){
    vec2 r = vec2(1, 1.73);
    vec2 h = r * 0.5;
    vec2 a = mod(st, r) - h;
    vec2 b = mod(st - h, r) - h;
    vec2 gv;
    if (length(a) < length(b)){
        gv = a;
    }
    else{
        gv = b;
    }
    float x = atan(gv.x, gv.y);
    float y = 0.5 - HexDist(gv);
    vec2 id = st-gv;

    return vec4(x, y, id.x, id.y);
}

void main() {
    
    vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;  
    vec3 finalColor = vec3(0.);

    st *= 5.;    

    vec4 hc = HexCoords(st);

    float c = smoothstep(.05, .1, hc.y * sin(hc.z * hc.w + u_time));
    //float c = smoothstep(.05, .1, hc.y);

    finalColor +=c;

    gl_FragColor = vec4(finalColor, 1.0);     
} 