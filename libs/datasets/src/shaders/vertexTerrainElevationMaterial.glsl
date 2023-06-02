uniform sampler2D image;
uniform float minHeight;
uniform float maxHeight;
uniform float heightDatum;

czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  float height = materialInput.height + heightDatum;
  float scaledHeight = clamp(
    (height - minHeight) / (maxHeight - minHeight),
    0.0,
    1.0
  );
  vec4 mappedColor = texture(image, vec2(scaledHeight, 0.5));
  mappedColor = czm_gammaCorrect(mappedColor);
  material.diffuse = mappedColor.rgb;
  material.alpha = mappedColor.a;
  return material;
}
