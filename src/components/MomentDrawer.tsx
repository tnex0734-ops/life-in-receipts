import React from 'react';
import { TracePanel } from './TracePanel';
import { Moment } from '../types/story';

interface MomentDrawerProps {
  moment: Moment | null;
  onClose: () => void;
  onViewReceipts?: () => void;
}

export const MomentDrawer: React.FC<MomentDrawerProps> = ({ moment, onClose, onViewReceipts }) => {
  return (
    <TracePanel
      moment={moment}
      receipt={null}
      onClose={onClose}
      onViewReceipts={onViewReceipts}
    />
  );
};
