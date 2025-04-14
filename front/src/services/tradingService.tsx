const serverAddr = "http://localhost:5092/api"
import axios, { AxiosRequestConfig } from "axios";
const tokens = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJnaXZlbl9uYW1lIjoidXNlciIsIm5iZiI6MTc0NDQ3Mjg4OSwiZXhwIjoxNzQ1MDc3Njg5LCJpYXQiOjE3NDQ0NzI4ODksImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTA5MiIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTA5MiJ9.mGx7_1fvDZsAupd4Vxf8YHZ2sf6o1OJYkCnLHbhHHYPix-QWe6bGO7BACRe-bGGhC6G_6KgAePnWhPy8ETVwhA"
import * as signalR from '@microsoft/signalr';
const hubUrl = "http://localhost:5092/api/chart"; 
import React from "react";
import { useState,useEffect,useRef } from "react";


const getToken = () => localStorage.getItem('token') || '';


export enum StockSortBy {
    Symbol = 0,
    Price = 1,
}

export const stockSortByMapping: { [key in keyof typeof StockSortBy]: number } = {
    Symbol: StockSortBy.Symbol,
    Price: StockSortBy.Price,
};


export const getStockQuery = async (query: string, sortby: string, isDecending:boolean, pageNumber:number,pageSize:number) => {
    try {
        console.log(`${serverAddr}/stock?Query=${query}&SortBy=${0}&IsDecsending=${isDecending}&PageNumber=${pageNumber}&PageSize=${pageSize}`)
        const options = {
            method: "GET",
            url: `${serverAddr}/stock?Query=${query}&SortBy=${stockSortByMapping[sortby as keyof typeof StockSortBy]}&IsDecsending=${isDecending}&PageNumber=${pageNumber}&PageSize=${pageSize}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`, 
            },
            withCredentials: false,
        };
        const { data } = await axios.request(options);
        return  data;
    } catch (error) {
        console.log("eeee");
        throw error;
    }
};




export const getStockPriceHistory = async (stockId: number) => {
    try {
        console.log(`${serverAddr}/PriceChart/stock/${stockId}`)

        const options = {
            method: "GET",
            url: `${serverAddr}/PriceChart/stock/${stockId}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`, 
            },
            withCredentials: false,
        };
        const { data } = await axios.request(options);
        return  data;
    } catch (error) {
        throw error;
    }
};