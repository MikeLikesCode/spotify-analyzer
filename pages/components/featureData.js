import Chart from "chart.js";
import React, { Component } from "react";

const features = [
  "acousticness",
  "danceability",
  "energy",
  "liveness",
  "speechiness",
  "valence",
];

class featureData extends Component {
  componentDidMount() {
    this.parseData();
  }

  componentDidUpdate() {
    this.parseData();
  }

  parseData = () => {
    const { data } = this.props;
    const dataset = this.createDataset(data);
    this.createChart(dataset);
  };

  avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

  createDataset(data) {
    const dataset = [];
    features.forEach((props) => {
      dataset[props] = data.length
        ? this.avg(data.map((feat) => feat && feat[props]))
        : data[props];
    });

    return dataset;
  }

  createChart(dataset) {
    const { type } = this.props;
    const ctx = document.getElementById("chart");
    const labels = Object.keys(dataset);
    const data = Object.values(dataset);

    new Chart(ctx, {
      type: type || "bar",
      maintainAspectRatio: true,
      data: {
        labels,
        datasets: [
          {
            label: "",
            data,
            backgroundColor: [
              "rgba(255, 99, 132, 0.3)",
              "rgba(255, 159, 64, 0.3)",
              "rgba(255, 206, 86, 0.3)",
              "rgba(75, 192, 192, 0.3)",
              "rgba(54, 162, 235, 0.3)",
              "rgba(104, 132, 245, 0.3)",
              "rgba(153, 102, 255, 0.3)",
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(255, 159, 64, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(104, 132, 245, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
        title: {
          display: true,
          text: `Audio Analysis`,
          fontSize: 18,
          fontColor: "#ffffff",
          padding: 30,
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                color: "rgba(255, 255, 255, 0.3)",
              },
              ticks: {
                fontSize: 12,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                color: "rgba(255, 255, 255, 0.3)",
              },
              ticks: {
                beginAtZero: true,
                min: 0,
                max: 1,
                fontSize: 12,
              },
            },
          ],
        },
      },
    });
  }

  render() {
    return <canvas id="chart" width="400" height="400" />;
  }
}

export default featureData;
