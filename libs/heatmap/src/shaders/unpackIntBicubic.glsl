// Reference: https://jvm-gaming.org/t/glsl-simple-fast-bicubic-filtering-shader-function/52549

float unpackInt(vec4 value) {
  vec3 coeff = vec3(16711680.0, 65280.0, 255.0);
  return dot(value.bgr, coeff) - dot(vec3(0.5), coeff);
}

float unpackIntBilinear(
  sampler2D image,
  vec2 texCoord,
  vec2 texSize,
  vec2 texelSize
) {
  vec2 unnormTexCoord = texCoord * texSize - 0.5;
  vec2 uv = (floor(unnormTexCoord) + 0.5) / texSize;
  vec2 f = fract(unnormTexCoord);
  float s1 = unpackInt(texture(image, uv));
  float s2 = unpackInt(texture(image, uv + vec2(texelSize.x, 0.0)));
  float s3 = unpackInt(texture(image, uv + vec2(0.0, texelSize.y)));
  float s4 = unpackInt(texture(image, uv + texelSize));
  return mix(mix(s1, s2, f.x), mix(s3, s4, f.x), f.y);
}

vec4 unpackIntBicubic_cubic(float v) {
  vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
  vec4 s = n * n * n;
  float x = s.x;
  float y = s.y - 4.0 * s.x;
  float z = s.z - 4.0 * s.y + 6.0 * s.x;
  float w = 6.0 - x - y - z;
  return vec4(x, y, z, w) * (1.0 / 6.0);
}

float unpackIntBicubic(
  sampler2D image,
  vec2 texCoord,
  vec2 texSize,
  vec2 texelSize
) {
  vec2 unnormTexCoord = texCoord * texSize - 0.5;
  vec2 f = fract(unnormTexCoord);
  vec4 cubicX = unpackIntBicubic_cubic(f.x);
  vec4 cubicY = unpackIntBicubic_cubic(f.y);
  vec4 c = (unnormTexCoord - f).xxyy + vec2(-0.5, 1.5).xyxy;
  vec4 s = vec4(cubicX.xz + cubicX.yw, cubicY.xz + cubicY.yw);
  vec4 offset = (c + vec4(cubicX.yw, cubicY.yw) / s) * texelSize.xxyy;
  float s1 = unpackIntBilinear(image, offset.xz, texSize, texelSize);
  float s2 = unpackIntBilinear(image, offset.yz, texSize, texelSize);
  float s3 = unpackIntBilinear(image, offset.xw, texSize, texelSize);
  float s4 = unpackIntBilinear(image, offset.yw, texSize, texelSize);
  float sx = s.x / (s.x + s.y);
  float sy = s.z / (s.z + s.w);
  return mix(mix(s4, s3, sx), mix(s2, s1, sx), sy);
}
