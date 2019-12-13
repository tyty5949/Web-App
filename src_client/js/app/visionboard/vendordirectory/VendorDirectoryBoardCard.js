import React, { useEffect, useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import EntryModal from './EntryModal';

const VendorDirectoryBoardCard = ({ defaultEntries }) => {
  const [entries, setEntries] = useState(defaultEntries);
  const [entriesLoaded, setEntriesLoaded] = useState(true);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [entryModalKey, setEntryModalKey] = useState(0);
  const [editId, setEditId] = useState(undefined);

  const fetchEntries = () => {
    setEntriesLoaded(false);
  };

  const onEntryModalClose = success => {
    setEntryModalOpen(false);
    setEntryModalKey(entryModalKey + 1);

    if (success) {
      fetchEntries();
    }
  };

  return (
    <div className="vendor-directory card delay-100-2">
      <div className="card-header">
        <h1>Vendor Directory</h1>
        <div className="action-group">
          <Button content="Add" icon="plus" size="mini" labelPosition="left" />
          <Icon name="cog" />
        </div>
      </div>
      <div className="horizontal-rule" />
      <div className="table-wrapper">
        <ReactTable
          data={entries}
          loading={!entriesLoaded}
          columns={[
            {
              Header: 'Name',
              accessor: 'name',
              maxWidth: 200
            },
            {
              Header: 'Primary Contact',
              id: 'primaryContact',
              accessor: d => d.primaryContact
            },
            {
              Header: 'Type',
              id: 'type',
              accessor: d => d.type,
              maxWidth: 150
            },
            {
              Header: 'Status',
              id: 'status',
              accessor: d => d.status,
              maxWidth: 150
            }
          ]}
          defaultSorted={[
            {
              accessor: 'order',
              desc: false
            }
          ]}
          defaultPageSize={10}
          style={{
            height: '100%'
          }}
          className="-highlight"
          getTdProps={(state, rowInfo) => {
            return {
              onClick: (e, handleOriginal) => {
                setEditId(rowInfo ? rowInfo.original._id : undefined);
                setEntryModalOpen(!!rowInfo);

                if (handleOriginal) {
                  handleOriginal();
                }
              }
            };
          }}
        />
      </div>

      {entryModalOpen && (
        <EntryModal
          key={`entry-modal-${entryModalKey}`}
          type={editId ? 'edit' : 'add'}
          open
          entryId={editId}
          onClose={onEntryModalClose}
        />
      )}
    </div>
  );
};

export default VendorDirectoryBoardCard;
