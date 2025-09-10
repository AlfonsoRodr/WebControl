export const facturas = [
    {
      numero: 'F001',
      fechaFactura: '2025-05-01',
      concepto: 'Compra de mobiliario',
      proveedor: 'Proveedor A',
      tipo: 'GASTOS GENERALES',
      baseIva: 100,
      totalIva: 21,
      total: 121,
      asignado: true,
      totalAsignado: 60,
      observaciones: 'Factura parcial de mobiliario'
    },
    {
      numero: 'F002',
      fechaFactura: '2025-05-05',
      concepto: 'Pago suscripción software',
      proveedor: 'Proveedor B',
      tipo: 'TIKETS GASTOS-VISA',
      baseIva: 200,
      totalIva: 42,
      total: 242,
      asignado: false,
      totalAsignado: 0,
      observaciones: 'Factura pendiente de asignar'
    }
  ];
