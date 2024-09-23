# CDK 3 Factor App

這是一個使用 AWS 建構的 3factor App，你可以 clone 這個專案直接進行開發，並使用 cdk 快速部署。

## What is 3factor app?

3Factor App 是一種現代全棧應用程式的架構模式，旨在構建穩健且可擴展的應用。它由三個主要因素組成：

1. 實時 GraphQL：提供靈活的 API 訪問和即時數據更新，確保用戶能夠快速反應（理想延遲低於 100 毫秒）。

2. 可靠的事件系統：業務邏輯通過事件觸發，簡化了 API 層的狀態管理，並確保事件的原子性和可靠性。

3. 異步無伺服器：使用無伺服器計算來處理事件，讓業務邏輯小而專注，並實現無限擴展性。

這種架構強調事件驅動和狀態變更，適合應用 CQRS 模式。與 12Factor 準則相比，3Factor 更專注於應用設計，而不僅僅是微服務架構。

更詳細的介紹可以參考：https://3factor.app/

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
