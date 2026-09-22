import { useEffect, useState } from 'react'
import { Mail, Phone, CreditCard, Calendar, Coins, AlertCircle } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import { StatusBadge } from '../ui/Badge'
import CustomerActionsMenu from './CustomerActionsMenu'
import CustomerFormFields, { buildInitialState, computeErrors } from './CustomerFormFields'

const dateFormat = { day: 'numeric', month: 'short', year: 'numeric' }
const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', dateFormat)

const TRANSACTIONS_PAGE_SIZE = 20

function SectionLabel({ children }) {
  return (
    <div className="text-xs font-medium tracking-wide text-ink-faint">{children}</div>
  )
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="flex items-center gap-1.5 text-sm text-ink-soft">
        {Icon && <Icon size={16} className="text-ink-faint" />}
        {label}
      </span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  )
}

function EmptySection({ label }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-ink-faint">
      {label}
    </div>
  )
}

function TransactionRow({ transaction }) {
  const isRedeem = transaction.pointsDelta < 0
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="text-sm font-medium text-ink">{transaction.description}</div>
        <div className="text-xs text-ink-faint">
          {transaction.site} · {formatDate(transaction.date)}
        </div>
      </div>
      <div className="text-right">
        {transaction.amount && <div className="text-sm font-medium text-ink">{transaction.amount}</div>}
        <div className={`text-xs font-medium ${isRedeem ? 'text-ink-faint' : 'text-status-active'}`}>
          {isRedeem ? '' : '+'}
          {transaction.pointsDelta} pts
        </div>
      </div>
    </div>
  )
}

function ActivityRow({ entry }) {
  return (
    <div className="px-4 py-3">
      <div className="text-sm font-medium text-ink">{entry.action}</div>
      <div className="text-xs text-ink-faint">
        {entry.actor} · {formatDate(entry.at)}
        {entry.detail ? ` · ${entry.detail}` : ''}
      </div>
    </div>
  )
}

function OfferRow({ offer }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="text-sm font-medium text-ink">{offer.name}</div>
        <div className="text-xs text-ink-faint">Valid until {formatDate(offer.validUntil)}</div>
      </div>
      <StatusBadge status={offer.status} />
    </div>
  )
}

export default function CustomerDetailPanel({
  open,
  customer,
  onClose,
  actionHandlers,
  existingCustomers,
  isEditing,
  onCancelEdit,
  onSubmitEdit,
}) {
  const [visibleTransactions, setVisibleTransactions] = useState(TRANSACTIONS_PAGE_SIZE)

  const [fields, setFields] = useState(() => buildInitialState('edit', customer))
  const [touched, setTouched] = useState({})
  const [showDuplicateBanner, setShowDuplicateBanner] = useState(false)

  // Re-seed the form from the current record each time editing starts, so a
  // second edit never shows stale values left over from the first.
  useEffect(() => {
    if (!isEditing || !customer) return
    setFields(buildInitialState('edit', customer))
    setTouched({})
    setShowDuplicateBanner(false)
  }, [isEditing, customer])

  if (!customer) return null

  const errors = computeErrors(fields, existingCustomers, customer.id)

  const handleFieldBlur = (field) => setTouched((prev) => ({ ...prev, [field]: true }))

  const handleFieldChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }))
    if (field === 'loyaltyCard') setShowDuplicateBanner(false)
  }

  const handleSaveEdit = () => {
    setTouched({ name: true, email: true, phone: true, loyaltyCard: true })

    const submitErrors = computeErrors(fields, existingCustomers, customer.id)

    if (submitErrors.loyaltyCard === 'This card number is already in use') {
      setShowDuplicateBanner(true)
    }

    if (Object.keys(submitErrors).length > 0) return

    onSubmitEdit(customer.id, {
      name: fields.name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      loyaltyCard: fields.loyaltyCard.trim(),
      tier: fields.tier,
      status: fields.status,
    })
  }

  // Newest first — a support call is always about something recent, and a
  // manual adjustment made seconds ago has to be at the top, not buried.
  const orderedTransactions = [...customer.transactions].sort((a, b) => b.date.localeCompare(a.date))
  const transactions = orderedTransactions.slice(0, visibleTransactions)
  const hasMoreTransactions = orderedTransactions.length > visibleTransactions

  return (
    <Drawer
      open={open}
      onClose={() => {
        onClose()
        setVisibleTransactions(TRANSACTIONS_PAGE_SIZE)
      }}
      title={isEditing ? 'Edit Customer' : 'Customer Details'}
      // The form is a single column of short fields — at the reading width
      // the detail view needs, the inputs would stretch absurdly wide. The
      // panel narrows into edit mode and widens back out, which also makes
      // the mode switch legible without a second surface appearing.
      size={isEditing ? 'md' : 'lg'}
      contentKey={`${customer.id}-${isEditing ? 'edit' : 'view'}`}
      headerActions={
        !isEditing && <CustomerActionsMenu customer={customer} {...actionHandlers} showAdjustPoints={false} />
      }
      footer={
        isEditing ? (
          <div className="flex items-center justify-end gap-4">
            <Button variant="secondary" onClick={onCancelEdit}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-4">
            <Button variant="primary" onClick={() => actionHandlers?.onAdjustPoints(customer)}>
              <Coins size={16} />
              Adjust points
            </Button>
          </div>
        )
      }
    >
      {isEditing ? (
        <>
          {showDuplicateBanner && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
              <AlertCircle size={16} className="shrink-0" />
              <span>A customer with this loyalty card number already exists.</span>
            </div>
          )}
          <CustomerFormFields
            fields={fields}
            touched={touched}
            errors={errors}
            onFieldChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
        </>
      ) : (
        <div className="space-y-6">
          <div>
            <Avatar name={customer.name} size="lg" />
            <div className="mt-3">
              <div className="text-xl font-semibold text-ink">{customer.name}</div>
              <div className="text-sm text-ink-faint">{customer.tier} tier</div>
              <div className="mt-2 flex gap-2">
                <StatusBadge status={customer.status} />
              </div>
              {/* "Why isn't my card working?" is the call this screen answers,
                  so the reason sits with the status, not buried in the log. */}
              {customer.status !== 'Active' && customer.statusNote && (
                <p className="mt-2 text-xs text-ink-soft">{customer.statusNote}</p>
              )}
            </div>
          </div>

          <div>
            <SectionLabel>Profile</SectionLabel>
            <div className="mt-2 rounded-xl border border-border divide-y divide-border">
              <Row icon={Mail} label="Email" value={customer.email} />
              <Row icon={Phone} label="Phone" value={customer.phone} />
              <Row icon={CreditCard} label="Loyalty Card" value={customer.loyaltyCard} />
              <Row icon={Calendar} label="Member Since" value={formatDate(customer.memberSince)} />
              <Row label="Points Balance" value={customer.pointsBalance.toLocaleString('en-GB')} />
            </div>
          </div>

          <div>
            <SectionLabel>Transactions</SectionLabel>
            {transactions.length === 0 ? (
              <div className="mt-2">
                <EmptySection label="No transactions yet." />
              </div>
            ) : (
              <div className="mt-2 rounded-xl border border-border divide-y divide-border">
                {transactions.map((t) => (
                  <TransactionRow key={t.id} transaction={t} />
                ))}
              </div>
            )}
            {hasMoreTransactions && (
              <div className="mt-2 flex justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setVisibleTransactions((v) => v + TRANSACTIONS_PAGE_SIZE)}
                >
                  Load more
                </Button>
              </div>
            )}
          </div>

          <div>
            <SectionLabel>Offers</SectionLabel>
            {customer.offers.length === 0 ? (
              <div className="mt-2">
                <EmptySection label="No offers for this customer." />
              </div>
            ) : (
              <div className="mt-2 rounded-xl border border-border divide-y divide-border">
                {customer.offers.map((o) => (
                  <OfferRow key={o.id} offer={o} />
                ))}
              </div>
            )}
          </div>

          <div>
            <SectionLabel>Activity Log</SectionLabel>
            {(customer.activityLog || []).length === 0 ? (
              <div className="mt-2">
                <EmptySection label="No recorded activity." />
              </div>
            ) : (
              <div className="mt-2 rounded-xl border border-border divide-y divide-border">
                {[...customer.activityLog]
                  .sort((a, b) => b.at.localeCompare(a.at))
                  .map((entry) => (
                    <ActivityRow key={entry.id} entry={entry} />
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Drawer>
  )
}
