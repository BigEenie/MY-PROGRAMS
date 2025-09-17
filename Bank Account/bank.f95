program bankAccount
implicit none
! To work on a program which
! Deposit Money
! Withdraw Money
! Check Balance
! Calculate interest (5% per annum)


!Part 1 - Declaration of Variables
real :: balance 
real :: interestRate
real :: time
real :: deposit
real :: withdrawal
real :: interest
real :: fiveYrsbal
integer :: i, Response, amount, amountG


balance = 1000
interestRate = 5
fiveYrsbal = 250

! Iteration - Using loop for the time frame

do i = 1, 5, 1
time = real(i)
interest = (balance*interestRate*time)/100
!print*, interest
end do

! We need a program which asks users if they need to withdraw or deposit money in their account

print*, 'Good Day, do you want to withdraw or deposit money?'
print*,  'Enter 1 for Withdrawal, Enter 2 for Deposit'
read*, Response
if (Response == 1) then
print*, 'Enter the amount you want to withdraw'
read*,amount

! We need a program which controls withdrawal
if(amount >= 250) then
print*, 'Insufficient balance'
else if(amount <= 10) then
print*, 'Amount too low for withdrawal!'
end if


else if(Response == 2) then
print*, 'Enter the amount you want to deposit'
read*, amountG

if(amountG >= 500) then
print*, 'Please visit any nearby office to make a deposit'
else if(amountG <= 500) then
print*, 'Please make a transfer to the customer care service account on our website with your full name'
end if

else
print*, 'Input Error'
end if






end program bankAccount


