import { combineReducers, configureStore } from "@reduxjs/toolkit";


const initialState = {
  employeeName: [
    { name: "Бакаенко А.", value: "bakaenko" },
    { name: "Азимбеов Е.", value: "azimbeov" },
    { name: "Чевган Д.", value: "chevgan" },
    { name: "Чанышев И.", value: "chanyshev" },
  ],
  responsiblePerson: [
    { name: "Дежурный NOC" },
    { name: "Антон" },
  ],
  siteName: [
    { name: "6667 ALMATY", client: "K-cell", address: "Павлодарская обеласть, г.K-cell"},
    { name: "KAZAKHTelecom", client: "Tele 2", address: "Павлодарская обеласть, г.Tele 2"},
  ],
};

const rootReducer = combineReducers({
  main: (state = initialState) => state,
});

export const store = configureStore({
  reducer: rootReducer,
});