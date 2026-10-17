# Pruebas

Cobertura prioritaria:

- contrato y determinismo de `generar_sql`;
- carga con `usar_adapter` verdadero y falso;
- rechazo de múltiples sentencias y operaciones de escritura;
- aislamiento entre esquemas de entrenamiento y validación;
- cálculo de EX, redondeo y orden condicional;
- presupuesto de hasta tres llamadas a `ejecutar`;
- smoke test reproducible en GPU T4.
