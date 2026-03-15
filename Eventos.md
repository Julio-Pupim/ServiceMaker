# Eventos principais do sistema

- ## Usuario
  - UserRegisteredEvent
  - ProviderProfileCreatedEvent
- ## Serviço
  - ProviderServiceCreatedEvent
  - ProviderServiceUpdatedEvent
- ## Pedido
  - ServiceRequestedEvent
  - ServiceRequestCancelledEvent
- ## Proposta
  - ProposalSubmittedEvent
  - ProposalAcceptedEvent
  - ProposalRejectedEvent
- ## Agenndamento
  - AppointmentScheduledEvent
  - AppointmentCancelledEvent
- ## Servico Finalizado
  - ServiceCompletedEvent
- ## Avaliação
  - ReviewCreatedEvent
- ## Pagamento
  - PaymentProcessedEvent

###  Fluxo  De eventos

Client cria request -> ServiceRequestedEvent
->
matching module encontra prestadores
->
Notification enviada
->
Prestador envia proposta
->
ProposalSubmittedEvent
->
Cliente aceita proposta
->
ProposalAcceptedEvent
->
AppointmentScheduledEvent
->
Serviço executado
->
ServiceCompletedEvent
->
ReviewCreatedEvent