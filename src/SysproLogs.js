import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from './config';
import './RibbonForm.css';
import { FaFileExport } from 'react-icons/fa';
import * as XLSX from 'xlsx';

function SysproLogs() {

    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [selectedXml, setSelectedXml] = useState('');
    const [showModal, setShowModal] = useState(false);

    const [filters, setFilters] = useState({
        salesOrder: '',
        event: '',
        createdBy: ''
    });

    const token = localStorage.getItem('jwt_token');

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {

        const response = await axios.get(
            `${API_BASE_URL}/Rep/sysprologs`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        setLogs(response.data);
        setFilteredLogs(response.data);
    };

    const handleFilter = (key, value) => {

        const newFilters = {
            ...filters,
            [key]: value
        };

        setFilters(newFilters);

        let data = [...logs];

        Object.keys(newFilters).forEach(f => {

            if (newFilters[f]) {

                data = data.filter(x =>
                    (x[f] || '')
                        .toString()
                        .toLowerCase()
                        .includes(newFilters[f].toLowerCase())
                );
            }
        });

        setFilteredLogs(data);
    };

    const exportExcel = () => {

        const worksheet =
            XLSX.utils.json_to_sheet(filteredLogs);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'SysproLogs'
        );

        XLSX.writeFile(
            workbook,
            `SysproLogs_${new Date().getTime()}.xlsx`
        );
    };

    return (
        <div className="ribbon-page">

            <div className="ribbon-bar">
                <div className="ribbon-buttons">

                    <button
                        className="ribbon-button"
                        onClick={exportExcel}
                    >
                        <FaFileExport className="icon" />
                        Export
                    </button>

                </div>
            </div>

            <div className="delivery-note-container">

                <div className="input-button-wrapper">

                    <input
                        placeholder="Sales Order"
                        value={filters.salesOrder}
                        onChange={(e) =>
                            handleFilter(
                                'salesOrder',
                                e.target.value
                            )}
                    />

                    <input
                        placeholder="Event"
                        value={filters.event}
                        onChange={(e) =>
                            handleFilter(
                                'event',
                                e.target.value
                            )}
                    />

                    <input
                        placeholder="Created By"
                        value={filters.createdBy}
                        onChange={(e) =>
                            handleFilter(
                                'createdBy',
                                e.target.value
                            )}
                    />

                </div>
            </div>

            <div className="form-content">

                <table className="ortho-table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sales Order</th>
                            <th>Event</th>
                            <th>Created By</th>
                            <th>Created Time</th>
                            <th>XML In</th>
                            <th>XML Out</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredLogs.map(log => (

                            <tr key={log.id}>

                                <td>{log.id}</td>
                                <td>{log.salesOrder}</td>
                                <td>{log.event}</td>
                                <td>{log.createdBy}</td>
                                <td>
                                    {new Date(
                                        log.createdTime
                                    ).toLocaleString()}
                                </td>

                                <td>
                                    <button
                                        className="ribbon-button"
                                        onClick={() => {

                                            setSelectedXml(
                                                log.action
                                            );

                                            setShowModal(true);
                                        }}
                                    >
                                        View
                                    </button>
                                </td>

                                <td>
                                    <button
                                        className="ribbon-button"
                                        onClick={() => {

                                            setSelectedXml(
                                                log.eventMessage
                                            );

                                            setShowModal(true);
                                        }}
                                    >
                                        View
                                    </button>
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {showModal && (

                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 9999
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            width: '90%',
                            height: '80%',
                            margin: '40px auto',
                            padding: '20px'
                        }}
                    >

                        <button
                            className="ribbon-button"
                            onClick={() =>
                                setShowModal(false)}
                        >
                            Close
                        </button>

                        <textarea
                            value={selectedXml}
                            readOnly
                            style={{
                                width: '100%',
                                height: '90%',
                                marginTop: '10px',
                                fontFamily: 'Consolas'
                            }}
                        />

                    </div>
                </div>

            )}

        </div>
    );
}

export default SysproLogs;