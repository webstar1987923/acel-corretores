import React from 'react';

class Sider extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const step = this.props.params.form;
    const height = (step * 100) / 5;

    return (
      <div className="div-steps-cadastro">
        <div>
          <div className="budget-cadastro" />
          <div className="div-line-budget">
            <div className="line-budget">
              <div className="step" style={{ height: `${height}%` }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GLOBAL.createContainer((props) => {
  const maxPointsForBudgetChart = 28 + 2;
  const profile = (Meteor.user() || {}).profile || {};
  const totalPointsForBudgetChart = Object.values(profile).filter(
    (field) => {
      if (typeof field === 'string') {
        return field;
      }
    },
  ).length;

  return {
    pointsForBudgetChartLabel: 'pointsForBudgetChartLabel',
    maxPointsForBudgetChart: (maxPointsForBudgetChart - totalPointsForBudgetChart),
    totalPointsForBudgetChart,
  };
}, Sider);
