#ifdef GL_ES
precision mediump float;
#endif

#define MAX_NUMBER 15;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in float x) {
    return fract(sin(x)*1e4);
}

float whiteCircle(in vec2 _st, in float _radius, vec2 coord){
    vec2 dist = _st-coord;
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

float blackCircle(in vec2 _st, in float _radius, vec2 coord){
    vec2 dist = _st-coord;
	return smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

void main() {
    vec2 st = (gl_FragCoord.xy * 1.0 - u_resolution.xy) / u_resolution.y;
    vec2 st1 = gl_FragCoord.xy/u_resolution.xy; 
    vec3 gradient1 = vec3(0.2471, 0.7882, 1.0);
    vec3 gradient2 = vec3(0.2, 0.2, 1.0);    
    vec3 finalColor = vec3(mix(gradient1, gradient2, -st.y));
    for (int i = 0; i < MAX_NUMBER i++)
    {
        float I = float(i);
        float center = 0.1;

        float znak = float(i) / 2.0 == 0.0 ? -1.0 : 1.0;
        float randomCoord1 = random(I) - 1.0;
        float randomCoord2 = random(I - 1.0) - 1.0;
        vec2 coord = vec2(randomCoord1, randomCoord2);      
    
        vec3 color1 = vec3(whiteCircle(st, abs(sin((u_time + I * 2.0)) * 0.1), coord));
        color1 *= vec3(0.1216, 0.498, 0.7686) - finalColor;
        vec3 color2 = vec3(blackCircle(st, abs(sin((u_time + I * 2.0 - 0.1)) * 0.1), coord));
        finalColor += color1 * color2;
    }    
    gl_FragColor = vec4(finalColor, 1.0);     
} 

