// Derived from: https://github.com/CesiumGS/cesium/blob/1.105/packages/engine/Source/Shaders/Model/ImageBasedLightingStageFS.glsl
// Specular term was removed, as I never apply it on terrain.
vec3 imageBasedLightingStage(
  vec3 positionEC,
  vec3 normalEC,
  vec3 lightDirectionEC,
  vec3 lightColorHdr,
  czm_pbrParameters pbrParameters
) {
  vec3 v = -positionEC;
  vec3 n = normalEC;
  vec3 l = normalize(lightDirectionEC);
  vec3 h = normalize(v + l);
  float NdotV = abs(dot(n, v)) + 0.001;
  float VdotH = clamp(dot(v, h), 0.0, 1.0);

  const mat3 yUpToZUp = mat3(
    -1.0,  0.0,  0.0,
     0.0,  0.0, -1.0,
     0.0,  1.0,  0.0
  );
  // Reference frame matrix can be computed only by world position and normal.
  mat3 referenceFrameMatrix = czm_transpose(
    czm_eastNorthUpToEyeCoordinates(v_positionMC, normalEC)
  );
  vec3 cubeDir = normalize(
    yUpToZUp * referenceFrameMatrix * normalize(reflect(-v, n))
  );
  vec3 diffuseIrradiance = czm_sphericalHarmonics(
    cubeDir,
    u_sphericalHarmonicCoefficients
  );

  return pbrParameters.diffuseColor * diffuseIrradiance;
}
