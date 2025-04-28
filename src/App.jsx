import GenerateDocuments from './pages/GenerateDocuments';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trademark-filing" element={<TrademarkFiling />} />
        <Route path="/generate-documents" element={<GenerateDocuments />} />
        {/* ... other routes ... */}
      </Routes>
    </Router>
  );
}

export default App; 