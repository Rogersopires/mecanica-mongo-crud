# Script PowerShell para setup de testes no Windows
Write-Host "🧪 Configurando ambiente de testes..." -ForegroundColor Cyan

# Instalar dependências de teste
Write-Host "📦 Instalando dependências de teste..." -ForegroundColor Yellow
npm install --save-dev jest supertest mongodb-memory-server

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
    
    Write-Host "🚀 Executando testes..." -ForegroundColor Blue
    npm test
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Todos os testes passaram!" -ForegroundColor Green
        
        Write-Host "📊 Gerando relatório de cobertura..." -ForegroundColor Blue
        npm run test:coverage
    } else {
        Write-Host "❌ Alguns testes falharam!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
}

Write-Host "`n📚 Comandos disponíveis:" -ForegroundColor Cyan
Write-Host "  npm test              - Executar todos os testes" -ForegroundColor White
Write-Host "  npm run test:watch    - Executar testes em modo watch" -ForegroundColor White
Write-Host "  npm run test:coverage - Executar com relatório de cobertura" -ForegroundColor White