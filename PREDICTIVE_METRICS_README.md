# Predictive Metrics Documentation

## Overview
This dashboard uses machine learning predictions to rank influencers by their growth potential. The predictions are based on two models: LightGBM and Random Forest, providing 1-month ahead forecasts for engagement rate and views.

## Data Source
Predictions are loaded from: `src/data/predictions/predictive_rankings.json`

## Key Metrics

### 1. **Engagement Rate Prediction**
- **Current Engagement Rate**: The current average engagement rate from historical data
- **Predicted Engagement Rate**: Average of LGBM and RF model predictions for 1 month ahead
- **Engagement Growth %**: Percentage change from current to predicted
  ```
  Growth % = ((Predicted ER - Current ER) / Current ER) × 100
  ```

### 2. **Views Prediction**
- **Current Views**: Current average views per post
- **Predicted Views**: Average of LGBM and RF model predictions for 1 month ahead
- **Views Growth %**: Percentage change from current to predicted
  ```
  Growth % = ((Predicted Views - Current Views) / Current Views) × 100
  ```

### 3. **Growth Percentile**
Calculated from the percentile rankings provided by each model:
- 90-100th percentile = 95 points
- 75-90th percentile = 82.5 points
- 50-75th percentile = 62.5 points
- 25-50th percentile = 37.5 points
- 0-25th percentile = 12.5 points

Average percentile score = (ER_LGBM + ER_RF + Views_LGBM + Views_RF) / 4

### 4. **Prediction Confidence**
Based on model agreement:
- **High**: Both models agree on direction for both ER and views
- **Medium**: Models agree on direction for either ER or views
- **Low**: Models disagree on direction for both metrics

### 5. **Growth Categories**
Based on average percentile score:
- **High Growth Potential**: ≥ 75th percentile
- **Moderate Growth Potential**: 50-75th percentile
- **Steady Growth**: 25-50th percentile
- **Stable Performance**: < 25th percentile

## Influencer Ranking Algorithm

Influencers are ranked by a combined growth score:
```
Growth Score = Views Growth % + Engagement Growth % + Growth Percentile
```

The influencers are then sorted by this score in descending order and assigned:
- Ranks 1-3: "highest-potential"
- Ranks 4-10: "fastest-growing"
- Ranks 11+: "top-performer"

## Model Details

### LightGBM (LGBM)
- Gradient boosting framework
- Optimized for speed and efficiency
- Good for handling categorical features

### Random Forest (RF)
- Ensemble of decision trees
- Robust to overfitting
- Good for capturing non-linear relationships

### Why Average Both Models?
Using the average of both models provides:
- More stable predictions
- Reduced impact of individual model biases
- Better generalization

## Growth Rate Scaling

Due to some extreme predictions in the data (some showing 5000%+ growth), we apply logarithmic scaling to preserve relative rankings while showing more reasonable numbers:

### Scaling Formula
- **Values ≤ 100%**: No scaling applied
- **Values > 100%**: `100 + (log₁₀(growth/100) × 50)`
- **Values ≥ -50%**: No scaling applied  
- **Values < -50%**: Similar logarithmic compression

### Examples
- 50% → 50% (unchanged)
- 100% → 100% (unchanged)
- 500% → 135% (compressed but still high)
- 1000% → 150% (compressed)
- 5000% → 185% (heavily compressed)

### Benefits
- **Preserves rankings**: Higher predictions still show as higher values
- **Shows meaningful differences**: Instead of many "+100%" values
- **More believable**: Compressed extreme values appear more realistic
- **Maintains utility**: Users can still identify high-growth influencers

If the raw predictions show extreme growth, it might indicate:
- Potential viral content opportunities
- Data collection issues
- Model training on different time horizons

## Important Notes

1. **Predictions are for 1 month ahead only** - The models are trained to predict 1 month into the future, not longer-term trends.

2. **Direction Agreement** - When models agree on whether metrics will increase or decrease, confidence is higher.

3. **Percentile Rankings** - These compare each influencer against the entire dataset, showing relative growth potential.

4. **Growth Percentage** - Can be negative, indicating predicted decline. The UI handles both positive and negative growth appropriately.

## Usage in Dashboard

### Influencer List
- Shows growth percentage (views growth) rounded to 2 decimal places
- Color-coded by rank type (highest-potential, fastest-growing, top-performer)

### Advanced Analytics - Predictive Modeling Section
- Current vs Predicted metrics comparison
- Growth percentages for both views and engagement
- Confidence level indicator
- Growth category badge
- Visual comparison bars for 1-month prediction

## Data Update Process
To update predictions:
1. Replace `src/data/predictions/predictive_rankings.json` with new predictions
2. Ensure the JSON format matches the existing structure
3. The dashboard will automatically load and process the new data