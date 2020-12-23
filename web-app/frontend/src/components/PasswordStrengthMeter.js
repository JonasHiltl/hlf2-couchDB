import React from 'react'
import zxcvbn from 'zxcvbn'

import { Progress, Typography } from 'antd';

const { Text} = Typography;

const PasswordStrengthMeter = (props) => {
    const { password } = props
    const testedResult = zxcvbn(password);
    const Percent = testedResult.score * 25

    const createPasswordLabel = (result) => {
        switch (result.score) {
          case 0:
            return '';
          case 1:
            return 'Weak';
          case 2:
            return 'Fair';
          case 3:
            return 'Good';
          case 4:
            return 'Strong';
          default:
            return 'Weak';
        }
      }

    return (
        <div>
            <Progress
                strokeColor={{
                    '100%': '#108ee9',
                    '0%': '#ff4d4f',
                }}
                percent={Percent}
                >
            </Progress>
            <div style={{ width: '100%', textAlign: 'center' }}>
                <Text strong>{createPasswordLabel(testedResult)}</Text>
            </div>
        </div>
    );
};

export default PasswordStrengthMeter;
