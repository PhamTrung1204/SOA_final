using Microsoft.AspNetCore.Mvc;
using PaymentService.Models;
using PaymentService.Services;
using System.Threading.Tasks;

namespace PaymentService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var payments = await _paymentService.GetAllPayments();
            return Ok(payments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var payment = await _paymentService.GetPaymentById(id);
            return payment != null ? Ok(payment) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Payment payment)
        {
            await _paymentService.CreatePayment(payment);
            return CreatedAtAction(nameof(GetById), new { id = payment.PaymentId }, payment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Payment payment)
        {
            await _paymentService.UpdatePayment(id, payment);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _paymentService.DeletePayment(id);
            return NoContent();
        }
    }
}