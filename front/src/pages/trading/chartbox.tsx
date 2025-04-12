import React, {use, useState,useRef, useEffect} from 'react';
import { Box, Button, TextField,Typography,ThemeProvider,CssBaseline } from '@mui/material';
import {createTheme, useTheme}  from '@mui/material/styles'
import { ColorModeContext, tokens } from '../../theme';
import { ColorType, createChart,AreaSeries, CandlestickSeries } from 'lightweight-charts';

interface ChartBoxProps {
    isCollapsed?: boolean; 
  }



let randomFactor = 25 + Math.random() * 25;
const samplePoint = (i: number) =>
    i *
        (0.5 +
            Math.sin(i / 1) * 0.2 +
            Math.sin(i / 2) * 0.4 +
            Math.sin(i / randomFactor) * 0.8 +
            Math.sin(i / 50) * 0.5) +
    200 +
    i * 2;

function generateData(
    numberOfCandles = 500,
    updatesPerCandle = 5,
    startAt = 100
) {
    const createCandle = (val: number, time: number) => ({
        time: new Date(time * 1000).toISOString().split('T')[0],
        open: val,
        high: val,
        low: val,
        close: val,
    });

    const updateCandle = (candle: { time: string; open: number; high: number; low: number; close: number }, val: number) => ({
        time: candle.time,
        close: val,
        open: candle.open,
        low: Math.min(candle.low, val),
        high: Math.max(candle.high, val),
    });

    randomFactor = 25 + Math.random() * 25;
    const date = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0));
    const numberOfPoints = numberOfCandles * updatesPerCandle;
    const initialData = [];
    const realtimeUpdates = [];
    let lastCandle;
    let previousValue = samplePoint(-1);
    for (let i = 0; i < numberOfPoints; ++i) {
        if (i % updatesPerCandle === 0) {
            date.setUTCDate(date.getUTCDate() + 1);
        }
        const time = (date.getTime() / 1000).toString(); // Convert to string for compatibility
        let value = samplePoint(i);
        const diff = (value - previousValue) * Math.random();
        value = previousValue + diff;
        previousValue = value;
        if (i % updatesPerCandle === 0) {
            const candle = createCandle(value, Number(time));
            lastCandle = candle;
            if (i >= startAt) {
                realtimeUpdates.push(candle);
            }
        } else {
            if (lastCandle) {
                const newCandle = updateCandle(lastCandle, value);
                lastCandle = newCandle;
                if (i >= startAt) {
                    realtimeUpdates.push(newCandle);
                } else if ((i + 1) % updatesPerCandle === 0) {
                    initialData.push(newCandle);
                }
            }
        }
    }

    return {
        initialData,
        realtimeUpdates,
    };
}



  const ChartBox: React.FC<ChartBoxProps> = ({isCollapsed}) => {
    const theme = useTheme();
    const chartContainer = useRef<HTMLDivElement>(null);
    const colors = tokens(theme.palette.mode);
    useEffect (() => {




            if (!chartContainer.current){
                console.log("eeeee");
                return
            }
            const chart = createChart(chartContainer.current, {
                layout: {
                    background: { type: ColorType.Solid, color: "transparent" },
                    attributionLogo: false,
                    textColor: colors.grey[400]
                },
                grid:{
                    vertLines:{
                        color: colors.primary[400]
                    },
                    horzLines:{
                        color: colors.primary[400]
                    }, 
                },


                width:chartContainer.current.clientWidth,
                height: chartContainer.current.clientHeight,

                
            });
            const series = chart.addSeries(CandlestickSeries, {
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            });

            const data = generateData(2500, 20, 1000);
            series.setData(data.initialData);
            chart.timeScale().fitContent();

            function* getNextRealtimeUpdate(realtimeData: Array<{ time: string; open: number; high: number; low: number; close: number }>) {
                for (const dataPoint of realtimeData) {
                    yield dataPoint;
                }
                return null;
            }
            const streamingDataProvider = getNextRealtimeUpdate(data.realtimeUpdates);
            const intervalID = setInterval(() => {
                const update = streamingDataProvider.next();
                if (update.done) {
                    clearInterval(intervalID);
                    return;
                }
                series.update(update.value);
            }, 100);
           
            return () => {

                chart.remove();
            };



    },[theme.palette.mode,isCollapsed])

    return (
        <Box 
            ref={chartContainer}
            sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
            }}
        />
    );
};

export default ChartBox;


// Lightweight Charts™ Example: Realtime updates
// https://tradingview.github.io/lightweight-charts/tutorials/demos/realtime-updates


// let randomFactor = 25 + Math.random() * 25;
// const samplePoint = i =>
//     i *
//         (0.5 +
//             Math.sin(i / 1) * 0.2 +
//             Math.sin(i / 2) * 0.4 +
//             Math.sin(i / randomFactor) * 0.8 +
//             Math.sin(i / 50) * 0.5) +
//     200 +
//     i * 2;

// function generateData(
//     numberOfCandles = 500,
//     updatesPerCandle = 5,
//     startAt = 100
// ) {
//     const createCandle = (val, time) => ({
//         time,
//         open: val,
//         high: val,
//         low: val,
//         close: val,
//     });

//     const updateCandle = (candle, val) => ({
//         time: candle.time,
//         close: val,
//         open: candle.open,
//         low: Math.min(candle.low, val),
//         high: Math.max(candle.high, val),
//     });

//     randomFactor = 25 + Math.random() * 25;
//     const date = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0));
//     const numberOfPoints = numberOfCandles * updatesPerCandle;
//     const initialData = [];
//     const realtimeUpdates = [];
//     let lastCandle;
//     let previousValue = samplePoint(-1);
//     for (let i = 0; i < numberOfPoints; ++i) {
//         if (i % updatesPerCandle === 0) {
//             date.setUTCDate(date.getUTCDate() + 1);
//         }
//         const time = date.getTime() / 1000;
//         let value = samplePoint(i);
//         const diff = (value - previousValue) * Math.random();
//         value = previousValue + diff;
//         previousValue = value;
//         if (i % updatesPerCandle === 0) {
//             const candle = createCandle(value, time);
//             lastCandle = candle;
//             if (i >= startAt) {
//                 realtimeUpdates.push(candle);
//             }
//         } else {
//             const newCandle = updateCandle(lastCandle, value);
//             lastCandle = newCandle;
//             if (i >= startAt) {
//                 realtimeUpdates.push(newCandle);
//             } else if ((i + 1) % updatesPerCandle === 0) {
//                 initialData.push(newCandle);
//             }
//         }
//     }

//     return {
//         initialData,
//         realtimeUpdates,
//     };
// }

// const chartOptions = {
//     layout: {
//         textColor: 'black',
//         background: { type: 'solid', color: 'white' },
//     },
//     height: 200,
// };
// const container = document.getElementById('container');
// /** @type {import('lightweight-charts').IChartApi} */
// const chart = createChart(container, chartOptions);

// // Only needed within demo page
// // eslint-disable-next-line no-undef
// window.addEventListener('resize', () => {
//     chart.applyOptions({ height: 200 });
// });

// const series = chart.addSeries(CandlestickSeries, {
//     upColor: '#26a69a',
//     downColor: '#ef5350',
//     borderVisible: false,
//     wickUpColor: '#26a69a',
//     wickDownColor: '#ef5350',
// });

// const data = generateData(2500, 20, 1000);

// series.setData(data.initialData);
// chart.timeScale().fitContent();
// chart.timeScale().scrollToPosition(5);

// // simulate real-time data
// function* getNextRealtimeUpdate(realtimeData) {
//     for (const dataPoint of realtimeData) {
//         yield dataPoint;
//     }
//     return null;
// }
// const streamingDataProvider = getNextRealtimeUpdate(data.realtimeUpdates);

// const intervalID = setInterval(() => {
//     const update = streamingDataProvider.next();
//     if (update.done) {
//         clearInterval(intervalID);
//         return;
//     }
//     series.update(update.value);
// }, 100);

// const styles = `
//     .buttons-container {
//         display: flex;
//         flex-direction: row;
//         gap: 8px;
//     }
//     .buttons-container button {
//         all: initial;
//         font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu,
//             sans-serif;
//         font-size: 16px;
//         font-style: normal;
//         font-weight: 510;
//         line-height: 24px; /* 150% */
//         letter-spacing: -0.32px;
//         padding: 8px 24px;
//         color: rgba(19, 23, 34, 1);
//         background-color: rgba(240, 243, 250, 1);
//         border-radius: 8px;
//         cursor: pointer;
//     }

//     .buttons-container button:hover {
//         background-color: rgba(224, 227, 235, 1);
//     }

//     .buttons-container button:active {
//         background-color: rgba(209, 212, 220, 1);
//     }
// `;

// const stylesElement = document.createElement('style');
// stylesElement.innerHTML = styles;
// container.appendChild(stylesElement);

// const buttonsContainer = document.createElement('div');
// buttonsContainer.classList.add('buttons-container');
// const button = document.createElement('button');
// button.innerText = 'Go to realtime';
// button.addEventListener('click', () => chart.timeScale().scrollToRealTime());
// buttonsContainer.appendChild(button);

// container.appendChild(buttonsContainer);