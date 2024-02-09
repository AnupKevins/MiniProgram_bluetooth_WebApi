import React, { useEffect, useState } from 'react';

const BluetoothBatteryReader = () => {
  const [batteryInfo, setBatteryInfo] = useState('');
  
  const readBatteryLevel = () => {
    if (!('bluetooth' in navigator)) {
      setBatteryInfo('Bluetooth API not supported.');
      return;
    }

    navigator.bluetooth.requestDevice({
      filters: [{
        services: ['battery_service']
      }]
    })
      .then(device => device.gatt.connect())
      .then(server => server.getPrimaryService('battery_service'))
      .then(service => service.getCharacteristic('battery_level'))
      .then(characteristic => characteristic.readValue())
      .then(value => {
        setBatteryInfo(`Battery percentage is ${value.getUint8(0)}.`);
      })
      .catch(error => {
        setBatteryInfo(error.toString());
      });
  };

  useEffect(() => {
    // Clean up any Bluetooth connections or resources on component unmount
    return () => {
      // You may need to handle disconnecting from Bluetooth here
      // if it's necessary for your use case
    };
  }, []);

  return (
    <div>
      <p>
        <button onClick={readBatteryLevel}>Read Bluetooth device's<br />battery level</button>
      </p>
      <p id="target">{batteryInfo}</p>
      <p>
        <small>Based on code snippets from <a href="https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web" target="_blank" rel="noopener">Google Developers</a>.</small>
      </p>
    </div>
  );
};

export default BluetoothBatteryReader;