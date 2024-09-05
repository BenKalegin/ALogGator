"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
const react_1 = __importStar(require("react"));
const axios_1 = __importDefault(require("axios"));
const eui_1 = require("@elastic/eui");
const moment_1 = __importDefault(require("moment"));
function Component() {
    const [logs, setLogs] = (0, react_1.useState)([]);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [startDate, setStartDate] = (0, react_1.useState)((0, moment_1.default)().subtract(1, 'day'));
    const [endDate, setEndDate] = (0, react_1.useState)((0, moment_1.default)());
    const [pagination, setPagination] = (0, react_1.useState)({
        pageIndex: 0,
        pageSize: 20,
        totalItemCount: 0,
    });
    (0, react_1.useEffect)(() => {
        fetchLogs();
    }, [startDate, endDate]);
    const fetchLogs = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://api.sumologic.com/api/v1/logs/search', {
                headers: {
                    'Authorization': 'Bearer YOUR_API_KEY_HERE',
                    'Content-Type': 'application/json',
                },
                params: {
                    q: searchQuery,
                    from: startDate.toISOString(),
                    to: endDate.toISOString(),
                },
            });
            setLogs(response.data.results);
            setPagination(prevPagination => (Object.assign(Object.assign({}, prevPagination), { totalItemCount: response.data.results.length })));
        }
        catch (error) {
            console.error('Error fetching logs:', error);
        }
    });
    const columns = [
        {
            field: 'timestamp',
            name: 'Timestamp',
            sortable: true,
            render: (date) => (0, moment_1.default)(date).format('YYYY-MM-DD HH:mm:ss')
        },
        { field: 'message', name: 'Message' },
        { field: 'source', name: 'Source' },
    ];
    const onTableChange = ({ page }) => {
        if (page) {
            setPagination(page);
        }
    };
    return (react_1.default.createElement(eui_1.EuiPageTemplate, null,
        react_1.default.createElement(eui_1.EuiPageSection, null,
            react_1.default.createElement(eui_1.EuiPageHeader, null,
                react_1.default.createElement(eui_1.EuiTitle, { size: "l" },
                    react_1.default.createElement("h1", null,
                        react_1.default.createElement(eui_1.EuiIcon, { type: "logstashFilter", size: "xl" }),
                        " ALogGator - Sumo Logic Log Viewer"))),
            react_1.default.createElement(eui_1.EuiPageSection, null,
                react_1.default.createElement(eui_1.EuiText, null,
                    react_1.default.createElement("p", null, "Search and analyze your Sumo Logic logs with ease.")),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(eui_1.EuiFieldSearch, { placeholder: "Search logs...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), onSearch: fetchLogs, fullWidth: true })),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiDatePicker, { selected: startDate, onChange: (date) => setStartDate(date), startDate: startDate, endDate: endDate, showTimeSelect: true })),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiDatePicker, { selected: endDate, onChange: (date) => setEndDate(date), startDate: startDate, endDate: endDate, showTimeSelect: true }))),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement(eui_1.EuiBasicTable, { items: logs, columns: columns, pagination: pagination, onChange: onTableChange })))));
}
//# sourceMappingURL=App.js.map